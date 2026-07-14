use std::sync::Mutex;
use tauri::{self, Manager};
use db::{database::Database, models::user::NewUser, repositories::user_repo::UserRepository} ;
mod util;

struct DbState(Mutex<Database>);

#[tauri::command]
fn add_test_user(state: tauri::State<'_, DbState>) {
    let user = NewUser {
        first_name: "Isaiah".to_string(),
        last_name: "Kibet".to_string(),
        email: "isaiahkrop254@gmail.com".to_string(),
        phone: Some("0768304385".to_string()),
        password: "Isa8205".to_string(),
        avatar: None,
        role: None,
        mfa_enabled: true,
        mfa_method: Some("email".to_string())
    };

    let mut db_guard = state.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    let mut user_repo = UserRepository;
    match user_repo.create(user, conn) {
        Ok(user) => {
            dbg!(user);
        },
        Err(e) => println!("Encountered an error: {}", e.to_string())
    }
}

pub async fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_dir = app.path().app_data_dir().expect("Failed to get the app data dir!");

            std::fs::create_dir_all(&app_dir)?;

            let db_path = app_dir.join("app.db");
            dbg!(&db_path);

            let db = Database::open(db_path).expect("Failed to initialize the database");

            app.manage(DbState(Mutex::new(db)));

            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![add_test_user])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
