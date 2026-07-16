use std::{fs, path};

use tauri::{AppHandle, Manager};

pub fn save_file(app: &AppHandle, sub_folder: &str, file_name: &str, file_bytes: &[u8]) -> Result<String, String> {
    let app_dir = app.path().app_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {}", e.to_string()))?;

    let media_files_dir = app_dir.join("media");

    let target_dir = media_files_dir.join(sub_folder);
    fs::create_dir_all(&target_dir)
        .map_err(|e| format!("Failed to create directory {:?}: {}", target_dir, e.to_string()))?;

    let file_path = path::Path::new(&file_name);
    let file_extension = path::Path::new(&file_path)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("bin");

    let safe_file_name = format!(
        "{}_{}.{}",
        file_path.file_stem().and_then(|s| s.to_str()).unwrap_or("file"),
        chrono::Utc::now().timestamp(),
        file_extension,
    );

    let absolute_path = target_dir.join(&safe_file_name);

    let relative_path = format!("{}/{}", sub_folder, safe_file_name);

    fs::write(&absolute_path, file_bytes)
        .map_err(|e| format!("Failed to write file to disk: {}", e.to_string()))?;

    Ok(relative_path)
}
