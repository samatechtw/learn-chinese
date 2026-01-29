use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize, sqlx::Type)]
pub struct TtsCacheEntity {
    pub id: Uuid,
    pub cache_key: String,
    pub text_content: String,
    pub language: String,
    pub voice_name: String,
    pub speech_rate: String,
    pub s3_key: String,
    pub audio_format: String,
    pub audio_size_bytes: Option<i64>,
    pub request_count: i32,
    pub last_accessed_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct TtsCacheCreateParams {
    pub cache_key: String,
    pub text_content: String,
    pub language: String,
    pub voice_name: String,
    pub speech_rate: String,
    pub s3_key: String,
    pub audio_format: String,
    pub audio_size_bytes: Option<i64>,
}
