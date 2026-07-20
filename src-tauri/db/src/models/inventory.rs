use chrono::NaiveDateTime;
use diesel::prelude::*;

// ==================================
// Product Category
// ==================================
#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::product_categories)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct ProductCategory {
    pub id: i32,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub image: Option<String>,
    pub is_active: bool,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

// =================================
// Products
// =================================
#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::products)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Product {
    pub id: i32, 
    pub sku: String,
    pub item_name: String,
    pub cost_price: f64,
    pub selling_price: f64,
    pub quantity_on_hand: i32,
    pub low_stock_threshold: Option<i32>,
    pub is_perishable: bool,
    pub expiration_date: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}
