use std::sync::{Mutex, MutexGuard};

use crate::DbState;
use db::database::Database;
use tauri::Manager;

pub fn acquire_db_guard(app: tauri::AppHandle) -> MutexGuard<'_, Database> {
    let db_state = app.state::<DbState>();
    let db_guard = db_state.0.lock().unwrap();

    return db_guard;
}
