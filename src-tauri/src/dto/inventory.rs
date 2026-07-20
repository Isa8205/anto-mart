use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct CreateProductCategoryRequest {
    pub parent_id: Option<i32>,
    pub name: String,
    pub description: Option<String>,
    pub image: Option<(String, Vec<u8>)>,
    pub is_active: bool,
}

#[derive(Serialize)]
pub struct ProductCategoryResponse {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub image: Vec<u8>,
    pub is_active: bool,
}
