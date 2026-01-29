use std::sync::Arc;

use async_trait::async_trait;
use lib_api::db::db_error::{map_sqlx_err, DbError};
use lib_types::entity::tts_cache_entity::{TtsCacheCreateParams, TtsCacheEntity};
use sqlx::{postgres::PgRow, PgPool, Row};

pub type DynTtsCacheRepo = Arc<dyn TtsCacheRepoTrait + Send + Sync>;

#[async_trait]
pub trait TtsCacheRepoTrait {
    async fn find_by_cache_key(&self, cache_key: &str) -> Result<Option<TtsCacheEntity>, DbError>;
    async fn create(&self, params: TtsCacheCreateParams) -> Result<TtsCacheEntity, DbError>;
    async fn increment_request_count(&self, cache_key: &str) -> Result<(), DbError>;
}

pub struct TtsCacheRepo {
    pub db: PgPool,
}

fn map_tts_cache_entity(row: PgRow) -> Result<TtsCacheEntity, sqlx::Error> {
    Ok(TtsCacheEntity {
        id: row.try_get("id")?,
        cache_key: row.try_get("cache_key")?,
        text_content: row.try_get("text_content")?,
        language: row.try_get("language")?,
        voice_name: row.try_get("voice_name")?,
        speech_rate: row.try_get("speech_rate")?,
        s3_key: row.try_get("s3_key")?,
        audio_format: row.try_get("audio_format")?,
        audio_size_bytes: row.try_get("audio_size_bytes")?,
        request_count: row.try_get("request_count")?,
        last_accessed_at: row.try_get("last_accessed_at")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
    })
}

#[async_trait]
impl TtsCacheRepoTrait for TtsCacheRepo {
    async fn find_by_cache_key(&self, cache_key: &str) -> Result<Option<TtsCacheEntity>, DbError> {
        let result = sqlx::query(
            r#"
            SELECT id, cache_key, text_content, language, voice_name, speech_rate,
                   s3_key, audio_format, audio_size_bytes, request_count,
                   last_accessed_at, created_at, updated_at
            FROM tts_cache
            WHERE cache_key = $1
            "#,
        )
        .bind(cache_key)
        .try_map(map_tts_cache_entity)
        .fetch_optional(&self.db)
        .await
        .map_err(map_sqlx_err)?;

        Ok(result)
    }

    async fn create(&self, params: TtsCacheCreateParams) -> Result<TtsCacheEntity, DbError> {
        let result = sqlx::query(
            r#"
            INSERT INTO tts_cache (cache_key, text_content, language, voice_name, speech_rate, s3_key, audio_format, audio_size_bytes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, cache_key, text_content, language, voice_name, speech_rate,
                      s3_key, audio_format, audio_size_bytes, request_count,
                      last_accessed_at, created_at, updated_at
            "#,
        )
        .bind(&params.cache_key)
        .bind(&params.text_content)
        .bind(&params.language)
        .bind(&params.voice_name)
        .bind(&params.speech_rate)
        .bind(&params.s3_key)
        .bind(&params.audio_format)
        .bind(params.audio_size_bytes)
        .try_map(map_tts_cache_entity)
        .fetch_one(&self.db)
        .await
        .map_err(map_sqlx_err)?;

        Ok(result)
    }

    async fn increment_request_count(&self, cache_key: &str) -> Result<(), DbError> {
        sqlx::query(
            r#"
            UPDATE tts_cache
            SET request_count = request_count + 1,
                last_accessed_at = now()
            WHERE cache_key = $1
            "#,
        )
        .bind(cache_key)
        .execute(&self.db)
        .await
        .map_err(map_sqlx_err)?;

        Ok(())
    }
}
