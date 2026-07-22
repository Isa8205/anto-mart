use std::sync::Mutex;
use tauri::{self, Manager};
use db::{
    database::Database,
};

use crate::commands::{
    auth::{add_role, add_user, login},
    inventory::{add_product_category, add_product},
};

mod utils;
mod commands;
mod dto;

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
        .invoke_handler(tauri::generate_handler![
            login,
            add_role,
            add_user,
            add_product_category,
            add_product,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
