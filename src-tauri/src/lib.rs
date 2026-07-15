use std::sync::Mutex;
use tauri::{self, Manager};
use db::{
    database::Database,
};
use commands::auth::login;

mod util;
mod commands;

pub struct DbState(Mutex<Database>);

pub async fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_dir = app.path().app_data_dir().expect("Failed to get the app data dir!");

            std::fs::create_dir_all(&app_dir)?;

            let db_path = app_dir.join("app.db");

            let db = Database::open(db_path).expect("Failed to initialize the database");

            app.manage(DbState(Mutex::new(db)));

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
