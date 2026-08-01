use crate::{commands::utils::get_business_config_path, dto::{BusinessResponse, Response}};
use std::fs;
use tauri::AppHandle;

#[tauri::command]
pub fn setup_business(data: CreateBusinessRequest, app: AppHandle) -> Response {
    let config_path = get_business_config_path(&app);
    if config_path.exists() {
        return Response::new(
            false,
            Some("Business information already exists.".to_string()),
        );
    }

    let json_data = serde_json::to_string_pretty(&data).unwrap();
    match fs::write(config_path, json_data) {
        Ok(_) => Response::new(true, None),
        Err(e) => Response::new(
            false,
            Some(format!("Failed to save business information: {}", e)),
        ),
    }
}

#[tauri::command]
pub fn is_business_setup(app: AppHandle) -> bool {
    get_business_config_path(&app).exists()
}

#[tauri::command]
pub fn get_business_info(app: AppHandle) -> Option<BusinessResponse> {
    let config_path = get_business_config_path(&app);
    if !config_path.exists() {
        return None;
    }

    let json_data = fs::read_to_string(config_path).unwrap();
    serde_json::from_str(&json_data).unwrap()
}
