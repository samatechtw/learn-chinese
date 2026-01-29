use serde::{Deserialize, Serialize};
use strum::{Display, EnumString};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize, Display, EnumString)]
#[strum(serialize_all = "lowercase")]
#[serde(rename_all = "lowercase")]
pub enum TtsLanguage {
    Chinese,
    Vietnamese,
}

impl TtsLanguage {
    pub fn default_voice(&self) -> &'static str {
        match self {
            TtsLanguage::Chinese => "zh-CN-XiaoxiaoNeural",
            TtsLanguage::Vietnamese => "vi-VN-HoaiMyNeural",
        }
    }

    pub fn locale(&self) -> &'static str {
        match self {
            TtsLanguage::Chinese => "zh-CN",
            TtsLanguage::Vietnamese => "vi-VN",
        }
    }

    pub fn as_str(&self) -> &'static str {
        match self {
            TtsLanguage::Chinese => "chinese",
            TtsLanguage::Vietnamese => "vietnamese",
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct TtsQuery {
    pub query: String,
    pub voice: Option<String>,
    pub rate: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct TtsCacheHitResponse {
    pub url: String,
    pub cached: bool,
    pub cache_key: String,
}

#[derive(Debug, Serialize)]
pub struct TtsCacheMissResponse {
    pub audio_base64: String,
    pub cached: bool,
    pub cache_key: String,
}

#[derive(Debug, Serialize)]
#[serde(untagged)]
pub enum TtsResponse {
    CacheHit(TtsCacheHitResponse),
    CacheMiss(TtsCacheMissResponse),
}
