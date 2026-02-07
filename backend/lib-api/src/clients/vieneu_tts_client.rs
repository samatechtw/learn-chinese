use crate::error::api_error::ApiError;
use lib_types::dto::tts::TtsLanguage;
use reqwest::Client;
use tracing::{info, warn};

#[derive(Clone)]
pub struct VieneuTtsClient {
    client: Client,
    base_url: String,
    model_key: Option<String>,
}

impl VieneuTtsClient {
    pub fn new(base_url: String, model_key: Option<String>) -> Self {
        if base_url.trim().is_empty() {
            warn!("Missing VieNeu TTS base URL, please set VIENEU_TTS_BASE_URL");
        }

        Self {
            client: Client::new(),
            base_url: base_url.trim_end_matches('/').to_string(),
            model_key,
        }
    }

    pub async fn configure_model(&self) {
        let Some(model_key) = self.model_key.as_deref() else {
            return;
        };

        let endpoint = format!("{}/set_model", self.base_url);
        let response = self
            .client
            .post(&endpoint)
            .json(&serde_json::json!({ "model_key": model_key }))
            .send()
            .await;

        match response {
            Ok(resp) if resp.status().is_success() => {
                info!("VieNeu TTS model configured: {}", model_key);
            }
            Ok(resp) => {
                let status = resp.status();
                let body = resp
                    .text()
                    .await
                    .unwrap_or_else(|_| "Unknown error".to_string());
                warn!(
                    "VieNeu TTS model configuration failed: status={}, model_key={}, body={}",
                    status, model_key, body
                );
            }
            Err(err) => {
                warn!(
                    "VieNeu TTS model configuration request failed: model_key={}, error={}",
                    model_key, err
                );
            }
        }
    }

    pub async fn synthesize(
        &self,
        text: &str,
        language: TtsLanguage,
        voice_id: Option<&str>,
    ) -> Result<Vec<u8>, ApiError> {
        if language != TtsLanguage::Vietnamese {
            return Err(
                ApiError::bad_request().message("VieNeu TTS currently supports vietnamese only")
            );
        }

        let endpoint = format!("{}/stream", self.base_url);
        let mut request = self.client.get(&endpoint).query(&[("text", text)]);
        if let Some(voice_id) = voice_id {
            if !voice_id.trim().is_empty() {
                request = request.query(&[("voice_id", voice_id)]);
            }
        }

        let response = request.send().await.map_err(|e| {
            ApiError::internal_error().message(format!("VieNeu TTS request failed: {}", e))
        })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());
            return Err(ApiError::internal_error()
                .message(format!("VieNeu TTS error ({}): {}", status, error_text)));
        }

        let audio_bytes = response.bytes().await.map_err(|e| {
            ApiError::internal_error().message(format!("Failed to read VieNeu TTS response: {}", e))
        })?;

        Ok(audio_bytes.to_vec())
    }
}
