use axum::{
    extract::{Path, Query, State},
    Json,
};
use base64::{engine::general_purpose::STANDARD as BASE64, Engine};
use lib_api::error::api_error::ApiError;
use lib_types::{
    dto::tts::{TtsCacheHitResponse, TtsCacheMissResponse, TtsLanguage, TtsQuery, TtsResponse},
    entity::tts_cache_entity::TtsCacheCreateParams,
};
use sha2::{Digest, Sha256};
use tracing::info;

use crate::api_context::ApiContext;

const DEV_PLACEHOLDER_KEYS: [&str; 2] = ["dev", "ci"];

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

    let voice = query
        .voice
        .unwrap_or_else(|| language.default_voice().to_string());
    let rate = query.rate.unwrap_or_else(|| "1.0".to_string());

    // Generate cache key
    let cache_key = generate_cache_key(text, &language, &voice, &rate);

    // Check cache
    let cached_entry = context
        .repo
        .tts_cache
        .find_by_cache_key(&cache_key)
        .await
        .map_err(|e| ApiError::internal_error().message(format!("Database error: {}", e)))?;

    if let Some(entry) = cached_entry {
        // Cache hit - increment request count and return presigned URL
        let _ = context
            .repo
            .tts_cache
            .increment_request_count(&cache_key)
            .await;

        let presigned_url = context
            .s3_client
            .presign_get_site_asset(&entry.s3_key, 3600);

        return Ok(Json(TtsResponse::CacheHit(TtsCacheHitResponse {
            url: presigned_url.to_string(),
            cached: true,
            cache_key,
        })));
    }

    // Bypass Azure/S3 in dev/ci
    let azure_key = &context.config.azure_tts_subscription_key;
    if DEV_PLACEHOLDER_KEYS.contains(&azure_key.as_str()) {
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
    let audio_bytes = context
        .azure_tts_client
        .synthesize(text, language, &voice, &rate)
        .await?;

    let audio_size = audio_bytes.len() as i64;

    // Upload to S3
    let s3_key = format!("tts/{}/{}.mp3", language.as_str(), cache_key);
    context
        .s3_client
        .upload_site_asset(&s3_key, audio_bytes.clone(), "audio/mpeg")
        .await?;

    // Save metadata to database
    let create_params = TtsCacheCreateParams {
        cache_key: cache_key.clone(),
        text_content: text.to_string(),
        language: language.as_str().to_string(),
        voice_name: voice,
        speech_rate: rate,
        s3_key,
        audio_format: "audio/mpeg".to_string(),
        audio_size_bytes: Some(audio_size),
    };

    context
        .repo
        .tts_cache
        .create(create_params)
        .await
        .map_err(|e| {
            ApiError::internal_error().message(format!("Failed to save cache entry: {}", e))
        })?;

    // Return base64-encoded audio for immediate playback
    let audio_base64 = BASE64.encode(&audio_bytes);

    Ok(Json(TtsResponse::CacheMiss(TtsCacheMissResponse {
        audio_base64,
        cached: false,
        cache_key,
    })))
}

fn generate_cache_key(text: &str, language: &TtsLanguage, voice: &str, rate: &str) -> String {
    let input = format!("{}|{}|{}|{}", text, language.as_str(), voice, rate);
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    hex::encode(result)
}
