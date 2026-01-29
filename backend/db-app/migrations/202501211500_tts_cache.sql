CREATE TABLE tts_cache (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key TEXT UNIQUE NOT NULL,
    text_content TEXT NOT NULL,
    language TEXT NOT NULL,
    voice_name TEXT NOT NULL,
    speech_rate TEXT NOT NULL DEFAULT '1.0',
    s3_key TEXT NOT NULL,
    audio_format TEXT NOT NULL DEFAULT 'audio/mpeg',
    audio_size_bytes BIGINT,
    request_count INTEGER NOT NULL DEFAULT 0,
    last_accessed_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX idx_tts_cache_cache_key ON tts_cache(cache_key);
CREATE INDEX idx_tts_cache_last_accessed ON tts_cache(last_accessed_at);

CREATE TRIGGER tts_cache_modified_column
BEFORE UPDATE ON tts_cache FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
