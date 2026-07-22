use db::{
    entities::{NewProductCategory, NewProduct}, repositories::{ProductCategoryRepository, ProductRepository},
};
use tauri::Manager;

use crate::{
    DbState, dto::{CreateProductCategoryRequest, CreateProductRequest, Response}, utils::media::save_file,
};

#[tauri::command]
pub fn add_product_category(data: CreateProductCategoryRequest, app: tauri::AppHandle) -> Response {
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

    match product_category_repo.create(new_product_category, conn) {
        Ok(_) => {
            Response { success: true, error: None }
        },
        Err(e) => {
            Response { success: false, error: Some(e.to_string()) }
        }
    }
}

#[tauri::command]
pub fn add_product(data: CreateProductRequest, app: tauri::AppHandle) -> Response {
    let db_state = app.state::<DbState>();
    let mut db_guard = db_state.0.lock().unwrap();

    let conn = &mut db_guard.conn;

    let mut product_repo = ProductRepository;

    let new_product = NewProduct {
        sku: data.sku.as_str(),
        item_name: data.item_name.as_str(),
        cost_price: data.cost_price,
        selling_price: data.selling_price,
        quantity_on_hand: data.quantity_on_hand,
        low_stock_threshold: data.low_stock_threshold,
        is_perishable: false,
        expiration_date: None,
        category_id: Some(data.category_id),
        tax_rate_id: None,
    };

    match product_repo.create(new_product, conn) {
        Ok(_) => {
            Response { success: true, error: None }
        },
        Err(e) => {
            Response { success: false, error: Some(e.to_string()) }
        }
    }
}
