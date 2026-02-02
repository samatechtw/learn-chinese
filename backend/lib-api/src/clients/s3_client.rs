use crate::error::api_error::ApiError;
use reqwest::Url;
use rusty_s3::{Bucket, Credentials, S3Action, UrlStyle};
use std::time::Duration;
use tracing::warn;

#[derive(Clone)]
pub struct S3Client {
    credentials: Credentials,
    pub tts_asset_bucket: Bucket,
}

pub const DEV_PLACEHOLDER_KEYS: [&str; 2] = ["dev", "ci"];

impl S3Client {
    pub fn new(s3_url: String, s3_access_key_id: String, s3_secret_access_key: String) -> S3Client {
        if s3_url.is_empty() || s3_secret_access_key.is_empty() || s3_access_key_id.is_empty() {
            warn!("Missing S3 configuration, please check the following information is provided: S3_URL, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY")
        }
        if DEV_PLACEHOLDER_KEYS.contains(&s3_secret_access_key.as_str()) {
            warn!("S3 client in dev mode");
        }
        let endpoint: Url = s3_url.parse().expect("s3 endpoint is invalid");
        let path_style = UrlStyle::Path;
        let tts_asset_name = "tts-assets";
        let region = "auto";
        let tts_asset_bucket = Bucket::new(endpoint.clone(), path_style, tts_asset_name, region)
            .expect("site-asset bucket url is invalid");

        let credentials = Credentials::new(s3_access_key_id, s3_secret_access_key);

        S3Client {
            credentials,
            tts_asset_bucket,
        }
    }

    fn presign_put(
        &self,
        bucket: &Bucket,
        filename: &str,
        expires: u64,
        content_type: &str,
        size: String,
    ) -> Result<Url, ApiError> {
        // Sign a request
        let presigned_url_duration = Duration::from_secs(expires);
        let mut action = bucket.put_object(Some(&self.credentials), filename);

        let query = action.query_mut();
        query.insert("Content-Type", content_type);
        query.insert("Content-Length", size);

        Ok(action.sign(presigned_url_duration))
    }

    async fn delete_asset(&self, bucket: &Bucket, object_key: &str) -> Result<(), ApiError> {
        let delete_object = bucket.delete_object(Some(&self.credentials), &object_key);

        let expires_in = Duration::from_secs(600);
        let url = delete_object.sign(expires_in);

        match reqwest::Client::new().delete(url).send().await {
            Ok(res) => {
                if res.status().is_success() {
                    Ok(())
                } else {
                    let error_message = match res.text().await {
                        Ok(text) => {
                            format!("Delete asset fail: {}, Response: {}", object_key, text)
                        }
                        Err(_) => format!("Delete asset fail: {}", object_key),
                    };

                    Err(ApiError::internal_error().message(error_message))
                }
            }
            Err(err) => Err(ApiError::internal_error().message(format!(
                "Failed to send DELETE request: {}, {}",
                object_key, err
            ))),
        }
    }

    pub fn presign_put_tts_asset(
        &self,
        filename: &str,
        expires: u64,
        content_type: &str,
        size: i64,
    ) -> Result<Url, ApiError> {
        self.presign_put(
            &self.tts_asset_bucket,
            filename,
            expires,
            content_type,
            size.to_string(),
        )
    }

    pub async fn verify_tts_asset(&self, object_key: &str) -> Result<bool, ApiError> {
        let head_object = self
            .tts_asset_bucket
            .head_object(Some(&self.credentials), &object_key);

        let expires_in = Duration::from_secs(600);
        let url = head_object.sign(expires_in);

        match reqwest::Client::new().head(url).send().await {
            Ok(res) => Ok(res.status().is_success()),
            Err(err) => Err(ApiError::internal_error()
                .message("Failed to send HEAD request".to_string() + &err.to_string())),
        }
    }

    pub async fn delete_tts_asset(&self, object_key: &str) -> Result<(), ApiError> {
        self.delete_asset(&self.tts_asset_bucket, object_key).await
    }

    pub fn presign_get_tts_asset(&self, object_key: &str, expires: u64) -> Url {
        let get_object = self
            .tts_asset_bucket
            .get_object(Some(&self.credentials), object_key);
        let expires_in = Duration::from_secs(expires);
        get_object.sign(expires_in)
    }

    pub async fn upload_tts_asset(
        &self,
        object_key: &str,
        data: Vec<u8>,
        content_type: &str,
    ) -> Result<(), ApiError> {
        let size = data.len() as i64;
        let presigned_url = self.presign_put(
            &self.tts_asset_bucket,
            object_key,
            600,
            content_type,
            size.to_string(),
        )?;

        let response = reqwest::Client::new()
            .put(presigned_url)
            .header("Content-Type", content_type)
            .header("Content-Length", size.to_string())
            .body(data)
            .send()
            .await
            .map_err(|e| {
                ApiError::internal_error().message(format!("Failed to upload to S3: {}", e))
            })?;

        if !response.status().is_success() {
            let error_text = response
                .text()
                .await
                .unwrap_or_else(|_| "Unknown error".to_string());
            return Err(
                ApiError::internal_error().message(format!("S3 upload failed: {}", error_text))
            );
        }

        Ok(())
    }
}
