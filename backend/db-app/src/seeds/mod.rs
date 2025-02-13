use lib_api::db::db_error::DbError;
use sqlx::PgPool;

pub mod s010_users;

pub async fn seed_all(db: &PgPool) -> Result<(), DbError> {
    s010_users::seed(db).await?;
    Ok(())
}
