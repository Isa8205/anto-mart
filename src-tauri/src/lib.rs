use std::sync::Mutex;
use rand_core::OsRng;
use tauri::{self, Manager};
use db::{
    database::Database,
    models::user::NewUser,
    repositories::UserRepository,
} ;
use serde::Serialize;

use argon2::{ password_hash::{ PasswordHasher, SaltString }, Argon2 };

mod util;
mod commands;

struct DbState(Mutex<Database>);

#[derive(Serialize)]
struct Response {
    success: bool,
    error: Option<String>
}

#[tauri::command]
fn add_user(mut data: NewUser, state: tauri::State<'_, DbState>) -> Response {
    let mut db_guard = state.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(&data.password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    data.password = password_hash;
    
    let mut user_repo = UserRepository;

    match user_repo.create(data, conn) {
        Ok(user) => {
            dbg!(user);
            Response {
                success: true,
                error: None,
            }
        },
        Err(e) => {
            println!("Encountered an error: {}", e.to_string());
            Response {
                success: false,
                error: Some(e.to_string()),
            }
        }
    }
}

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
        .invoke_handler(tauri::generate_handler![add_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
