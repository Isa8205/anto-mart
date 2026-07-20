use db::{
    entities::NewProductCategory,
    repositories::ProductCategoryRepository,
};
use tauri::Manager;

use crate::{
    DbState,
    dto::CreateProductCategoryRequest,
    utils::media::save_file,
};

#[tauri::command]
pub fn add_product_category(data: CreateProductCategoryRequest, app: tauri::AppHandle) {
    let db_state = app.state::<DbState>();
    let mut db_guard = db_state.0.lock().unwrap();

    let conn = &mut db_guard.conn;

    let image_path = match data.image {
        Some((file_name, file_bytes)) => {
            if let Ok(path) = save_file(&app, "inventory/categories", &file_name, &file_bytes) {
                Some(path)
            } else {
                None
            }
        }
        None => None,
    };

    let mut product_category_repo = ProductCategoryRepository;

    let new_product_category = NewProductCategory {
        parent_id: data.parent_id,
        name: data.name.as_str(),
        slug: data.name.as_str(),
        description: data.description,
        image: image_path,
        is_active: data.is_active,
    };

    product_category_repo.create(new_product_category, conn);
}
