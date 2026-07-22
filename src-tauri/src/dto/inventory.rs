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
