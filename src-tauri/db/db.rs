use anyhow::Result;
use sea_orm::{Database, DatabaseConnection};
use std::fs;
use tauri::{AppHandle, Manager};

pub async fn init_db(app: &AppHandle) -> Result<DatabaseConnection> {
    // App config dir:
    // Linux: ~/.config/your-app
    // Windows: %AppData%
    // macOS: ~/Library/Application Support
    let app_config_dir = app.path().app_config_dir()?;

    // Ensure directory exists
    fs::create_dir_all(&app_config_dir)?;

    let db_path = app_config_dir.join("app.sqlite");

    let db_url = format!("sqlite:{}?mode=rwc", db_path.display());

    let db = Database::connect(&db_url).await?;

    Ok(db)
}
