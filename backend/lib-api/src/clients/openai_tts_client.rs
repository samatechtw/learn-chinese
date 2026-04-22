use crate::error::api_error::ApiError;
use lib_types::dto::tts::TtsLanguage;
use reqwest::Client;
use tracing::warn;

#[derive(Clone)]
pub struct OpenAiTtsClient {
    client: Client,
    base_url: Option<String>,
    api_key: Option<String>,
    model: String,
    voice: String,
}

impl OpenAiTtsClient {
    pub fn new(
        base_url: Option<String>,
        api_key: Option<String>,
        model: String,
        voice: String,
    ) -> Self {
        let normalized_base_url = base_url
            .map(|value| value.trim().trim_end_matches('/').to_string())
            .filter(|value| !value.is_empty());

        if normalized_base_url.is_none() {
            warn!("OpenAI-compatible TTS disabled, please set OPENAI_TTS_BASE_URL");
        }

        Self {
            client: Client::builder()
                .timeout(std::time::Duration::from_secs(15))
                .build()
                .unwrap_or_else(|_| Client::new()),
            base_url: normalized_base_url,
            api_key: api_key
                .map(|value| value.trim().to_string())
                .filter(|value| !value.is_empty()),
            model,
            voice,
        }
    }

    pub fn is_configured(&self) -> bool {
        self.base_url.is_some()
    }

    pub fn default_voice(&self) -> &str {
        &self.voice
    }

    pub async fn synthesize(&self, text: &str, language: TtsLanguage) -> Result<Vec<u8>, ApiError> {
        if language != TtsLanguage::Chinese {
            return Err(ApiError::bad_request()
                .message("OpenAI-compatible TTS currently supports chinese only"));
        }

        let Some(base_url) = self.base_url.as_deref() else {
            return Err(
                ApiError::internal_error().message("OpenAI-compatible TTS is not configured")
            );
        };

        let endpoint = format!("{}/v1/audio/speech", base_url);
        let mut request = self.client.post(&endpoint).json(&serde_json::json!({
            "model": self.model,
            "input": text,
            "voice": self.voice,
            "response_format": "wav",
        }));

        if let Some(api_key) = self.api_key.as_deref() {
            request = request.bearer_auth(api_key);
        }

        let response = request.send().await.map_err(|e| {
            ApiError::internal_error()
                .message(format!("OpenAI-compatible TTS request failed: {}", e))
        })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());
            return Err(ApiError::internal_error().message(format!(
                "OpenAI-compatible TTS error ({}): {}",
                status, error_text
            )));
        }

        let audio_bytes = response.bytes().await.map_err(|e| {
            ApiError::internal_error().message(format!(
                "Failed to read OpenAI-compatible TTS response: {}",
                e
            ))
        })?;

        Ok(audio_bytes.to_vec())
    }
}
