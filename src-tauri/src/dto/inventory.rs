use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Deserialize, TS)]
#[ts(export)]
pub struct CreateProductCategoryRequest {
    pub parent_id: Option<i32>,
    pub name: String,
    pub description: Option<String>,
    pub image: Option<(String, Vec<u8>)>,
    pub is_active: bool,
}

#[derive(Serialize, TS)]
#[ts(export)]
pub struct ProductCategoryResponse {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub image: Vec<u8>,
    pub is_active: bool,
}

#[derive(Deserialize, TS)]
#[ts(export)]
pub struct CreateProductRequest {
    pub sku: String,
    pub item_name: String,
    pub category_id: i32,
    pub cost_price: f64,
    pub selling_price: f64,
    pub quantity_on_hand: i32,
    pub low_stock_threshold: Option<i32>,
}

#[derive(Serialize, TS)]
#[ts(export)]
pub struct ProductResponse {
    pub id: i32,
    pub item_name: String,
    pub cost_price: f64,
    pub selling_price: f64,
    pub stock: i32,
    pub low_stock_threshold: Option<i32>,
}
