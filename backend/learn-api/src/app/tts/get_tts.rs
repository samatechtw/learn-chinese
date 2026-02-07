use axum::{
    extract::{Path, Query, State},
    Json,
};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use lib_api::{clients::azure_tts_client::DEV_PLACEHOLDER_KEYS, error::api_error::ApiError};
use lib_types::{
    dto::tts::{TtsCacheHitResponse, TtsCacheMissResponse, TtsLanguage, TtsQuery, TtsResponse},
    entity::tts_cache_entity::TtsCacheCreateParams,
};
use sha2::{Digest, Sha256};
use tracing::{error, info};

use crate::{api_context::ApiContext, config::TtsProvider};

pub async fn get_tts(
    Path(language): Path<String>,
    Query(query): Query<TtsQuery>,
    State(context): State<ApiContext>,
) -> Result<Json<TtsResponse>, ApiError> {
    // Parse and validate language
    let language: TtsLanguage = language.parse().map_err(|_| {
        ApiError::bad_request().message("Invalid language. Must be 'chinese' or 'vietnamese'")
    })?;

    let text = query.query.trim();
    if text.is_empty() {
        return Err(ApiError::bad_request().message("Query text cannot be empty"));
    }

    let provider = resolve_provider(context.config.tts_provider, language);

    let (voice, vieneu_voice_id) = match provider {
        TtsProvider::Azure => {
            let voice = match query.voice.as_deref() {
                Some(raw_voice) => {
                    let trimmed = raw_voice.trim();
                    if trimmed.is_empty() {
                        return Err(ApiError::bad_request().message("Voice cannot be empty"));
                    }
                    if !is_valid_azure_voice(&language, trimmed) {
                        return Err(ApiError::bad_request().message(
                            "Invalid voice. Must match language locale and end with 'Neural'",
                        ));
                    }
                    trimmed.to_string()
                }
                None => language.default_voice().to_string(),
            };
            (voice, None)
        }
        TtsProvider::Vieneu => {
            if language != TtsLanguage::Vietnamese {
                return Err(ApiError::bad_request()
                    .message("VieNeu TTS currently supports vietnamese only"));
            }
            let selected_voice = match query.voice.as_deref() {
                Some(raw_voice) => {
                    let trimmed = raw_voice.trim();
                    if trimmed.is_empty() {
                        return Err(ApiError::bad_request().message("Voice cannot be empty"));
                    }
                    if !is_valid_vieneu_voice(trimmed) {
                        return Err(ApiError::bad_request().message(
                            "Invalid voice_id. Use a valid VieNeu voice id (max 128 chars)",
                        ));
                    }
                    Some(trimmed.to_string())
                }
                None => context
                    .config
                    .vieneu_tts_voice_id
                    .as_ref()
                    .map(|value| value.trim().to_string())
                    .filter(|value| !value.is_empty()),
            };
            let voice_name = selected_voice
                .clone()
                .unwrap_or_else(|| "default".to_string());
            (voice_name, selected_voice)
        }
    };

    let rate = match provider {
        TtsProvider::Azure => match query.rate.as_deref() {
            Some(raw_rate) => {
                let trimmed = raw_rate.trim();
                if trimmed.is_empty() {
                    return Err(ApiError::bad_request().message("Rate cannot be empty"));
                }
                if !is_valid_rate(trimmed) {
                    return Err(ApiError::bad_request().message(
                        "Invalid rate. Use a multiplier (0.5-2.0), a percentage (-100% to 100%), or a named rate",
                    ));
                }
                trimmed.to_string()
            }
            None => "0%".to_string(),
        },
        TtsProvider::Vieneu => {
            if query.rate.is_some() {
                info!("VieNeu TTS ignores rate parameter");
            }
            "n/a".to_string()
        }
    };

    // Generate cache key
    let cache_key = generate_cache_key(text, &language, provider.as_str(), &voice, &rate);

    // Check cache
    let cached_entry = context
        .repo
        .tts_cache
        .find_by_cache_key(&cache_key)
        .await
        .map_err(|e| {
            error!("TTS cache lookup failed: {}", e);
            ApiError::internal_error().message(format!("Database error: {}", e))
        })?;

    if let Some(entry) = cached_entry {
        // Cache hit - increment request count and return presigned URL
        let _ = context
            .repo
            .tts_cache
            .increment_request_count(&cache_key)
            .await;

        let presigned_url = context.s3_client.presign_get_tts_asset(&entry.s3_key, 3600);

        return Ok(Json(TtsResponse::CacheHit(TtsCacheHitResponse {
            url: presigned_url.to_string(),
            cached: true,
            cache_key,
        })));
    }

    // Bypass Azure/S3 in dev/ci
    let azure_key = &context.config.azure_tts_subscription_key;
    if provider == TtsProvider::Azure && DEV_PLACEHOLDER_KEYS.contains(&azure_key.as_str()) {
        info!(
            "TTS dev: bypass Azure/S3 for key '{}', returning mock audio",
            azure_key
        );
        // Return a minimal valid MP3 frame as mock audio (silent)
        let mock_audio = vec![0xFF, 0xFB, 0x90, 0x00];
        let audio_base64 = BASE64.encode(&mock_audio);
        return Ok(Json(TtsResponse::CacheMiss(TtsCacheMissResponse {
            audio_base64,
            cached: false,
            cache_key,
        })));
    }

    // Cache miss - synthesize audio
    let (audio_bytes, content_type, extension) = match provider {
        TtsProvider::Azure => {
            let audio = context
                .azure_tts_client
                .synthesize(text, language, &voice, &rate)
                .await
                .map_err(|e| {
                    error!(
                        "Azure TTS synthesize failed: status={}, message={}",
                        e.status, e.message
                    );
                    e
                })?;
            (audio, "audio/mpeg", "mp3")
        }
        TtsProvider::Vieneu => {
            let audio = context
                .vieneu_tts_client
                .synthesize(text, language, vieneu_voice_id.as_deref())
                .await
                .map_err(|e| {
                    error!("VieNeu TTS synthesize failed: {}", e.message);
                    e
                })?;
            (audio, "audio/wav", "wav")
        }
    };

    let audio_size = audio_bytes.len() as i64;

    // Upload to S3
    let s3_key = format!("tts/{}/{}.{}", language.as_str(), cache_key, extension);
    context
        .s3_client
        .upload_tts_asset(&s3_key, audio_bytes.clone(), content_type)
        .await
        .map_err(|e| {
            error!("TTS S3 upload failed: {}", e);
            e
        })?;

    // Save metadata to database
    let create_params = TtsCacheCreateParams {
        cache_key: cache_key.clone(),
        text_content: text.to_string(),
        language: language.as_str().to_string(),
        voice_name: voice,
        speech_rate: rate,
        s3_key,
        audio_format: content_type.to_string(),
        audio_size_bytes: Some(audio_size),
    };

    context
        .repo
        .tts_cache
        .create(create_params)
        .await
        .map_err(|e| {
            error!("TTS cache create failed: {}", e);
            ApiError::internal_error().message(format!("Failed to save cache entry: {}", e))
        })?;

    // Return base64-encoded audio for immediate playback
    let audio_base64 = if content_type == "audio/mpeg" {
        BASE64.encode(&audio_bytes)
    } else {
        format!(
            "data:{};base64,{}",
            content_type,
            BASE64.encode(&audio_bytes)
        )
    };

    Ok(Json(TtsResponse::CacheMiss(TtsCacheMissResponse {
        audio_base64,
        cached: false,
        cache_key,
    })))
}

fn generate_cache_key(
    text: &str,
    language: &TtsLanguage,
    provider: &str,
    voice: &str,
    rate: &str,
) -> String {
    let input = format!(
        "{}|{}|{}|{}|{}",
        text,
        language.as_str(),
        provider,
        voice,
        rate
    );
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    hex::encode(result)
}

fn resolve_provider(configured: TtsProvider, language: TtsLanguage) -> TtsProvider {
    if language == TtsLanguage::Chinese {
        TtsProvider::Azure
    } else {
        configured
    }
}

fn is_valid_azure_voice(language: &TtsLanguage, voice: &str) -> bool {
    let locale = language.locale();
    voice.starts_with(locale)
        && voice.contains('-')
        && voice.ends_with("Neural")
        && voice.len() <= 64
}

fn is_valid_vieneu_voice(voice: &str) -> bool {
    !voice.chars().any(char::is_control) && voice.len() <= 128
}

fn is_valid_rate(rate: &str) -> bool {
    match rate {
        "default" | "x-slow" | "slow" | "medium" | "fast" | "x-fast" => return true,
        _ => {}
    }

    if let Some(percent) = rate.strip_suffix('%') {
        if let Ok(value) = percent.parse::<i32>() {
            return (-100..=100).contains(&value);
        }
        return false;
    }

    if let Ok(multiplier) = rate.parse::<f32>() {
        return (0.5..=2.0).contains(&multiplier);
    }

    false
}

impl TtsProvider {
    fn as_str(self) -> &'static str {
        match self {
            TtsProvider::Azure => "azure",
            TtsProvider::Vieneu => "vieneu",
        }
    }
}
