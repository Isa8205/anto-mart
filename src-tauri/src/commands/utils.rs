use std::{fs, path::PathBuf};

use tauri::{AppHandle, Manager};

pub fn get_business_config_path(app: &AppHandle) -> PathBuf {
    let config_dir = app.path().app_data_dir().unwrap();
    if !config_dir.exists() {
        fs::create_dir_all(&config_dir).unwrap();
    }
    config_dir.join(".business.json")
}
