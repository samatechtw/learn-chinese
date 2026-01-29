use lib_api::clients::azure_tts_client::AzureTtsClient;
use lib_api::clients::s3_client::S3Client;

use crate::{config::Config, db::app_repo::AppRepo};
use std::sync::Arc;

#[derive(Clone)]
pub struct ApiContext {
    pub config: Arc<Config>,
    pub repo: AppRepo,
    pub s3_client: S3Client,
    pub azure_tts_client: AzureTtsClient,
}
