use tauri::{App, State};
use sea_orm::DatabaseConnection;

mod db;

struct AppState {
    db: DatabaseConnection,
}

pub async fn run() {
    let db = db::connection::connect_db().await;

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState { db })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
