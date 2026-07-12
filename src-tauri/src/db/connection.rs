use sea_orm::{Database, DatabaseConnection};

pub async fn connect_db() -> DatabaseConnection {
    Database::connect("sqlite://app.db?mode=rwc")
        .await
        .expect("Failed to connect to DB")
}