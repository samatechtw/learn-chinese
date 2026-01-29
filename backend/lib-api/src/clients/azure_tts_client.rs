use crate::error::api_error::ApiError;
use lib_types::dto::tts::TtsLanguage;
use reqwest::Client;
use tracing::warn;

#[derive(Clone)]
pub struct AzureTtsClient {
    client: Client,
    subscription_key: String,
    region: String,
}

impl AzureTtsClient {
    pub fn new(subscription_key: String, region: String) -> Self {
        if subscription_key.is_empty() || region.is_empty() {
            warn!("Missing Azure TTS configuration, please check the following information is provided: AZURE_TTS_SUBSCRIPTION_KEY, AZURE_TTS_REGION")
        }
        Self {
            client: Client::new(),
            subscription_key,
            region,
        }
    }

    pub async fn synthesize(
        &self,
        text: &str,
        language: TtsLanguage,
        voice: &str,
        rate: &str,
    ) -> Result<Vec<u8>, ApiError> {
        let endpoint = format!(
            "https://{}.tts.speech.microsoft.com/cognitiveservices/v1",
            self.region
        );

        let ssml = self.build_ssml(text, language, voice, rate);

        let response = self
            .client
            .post(&endpoint)
            .header("Ocp-Apim-Subscription-Key", &self.subscription_key)
            .header("Content-Type", "application/ssml+xml")
            .header(
                "X-Microsoft-OutputFormat",
                "audio-16khz-128kbitrate-mono-mp3",
            )
            .body(ssml)
            .send()
            .await
            .map_err(|e| {
                ApiError::internal_error().message(format!("Azure TTS request failed: {}", e))
            })?;

        if !response.status().is_success() {
            let status = response.status();
            let error_text = response
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());
            return Err(ApiError::internal_error()
                .message(format!("Azure TTS error ({}): {}", status, error_text)));
        }

        let audio_bytes = response.bytes().await.map_err(|e| {
            ApiError::internal_error().message(format!("Failed to read Azure TTS response: {}", e))
        })?;

        Ok(audio_bytes.to_vec())
    }

    fn build_ssml(&self, text: &str, language: TtsLanguage, voice: &str, rate: &str) -> String {
        let locale = language.locale();
        let escaped_text = html_escape(text);

        format!(
            r#"<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="{}">
    <voice name="{}">
        <prosody rate="{}">
            {}
        </prosody>
    </voice>
</speak>"#,
            locale, voice, rate, escaped_text
        )
    }
}

fn html_escape(s: &str) -> String {
    s.replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&apos;")
}
