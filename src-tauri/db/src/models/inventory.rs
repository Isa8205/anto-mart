use chrono::NaiveDateTime;
use diesel::{Selectable, deserialize::Queryable, prelude::Insertable, query_builder::AsChangeset};

// ======= Product Categoreis ======
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

#[derive(Insertable)]
#[diesel(table_name = crate::schema::product_categories)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct NewProductCategory<'a> {
    pub parent_id: Option<i32>,
    pub name: &'a str,
    pub slug: &'a str,
    pub description: &'a str,
    pub image: Option<&'a str>,
    pub is_active: bool,
}

#[derive(AsChangeset)]
#[diesel(table_name = crate::schema::product_categories)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct UpdateProductCategory<'a> {
    pub name: Option<&'a str>,
    pub description: Option<Option<&'a str>>,
    pub image: Option<Option<&'a str>>,
    pub is_active: Option<bool>
}

// ====== Procucts ======
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

#[derive(Insertable)]
#[diesel(table_name = crate::schema::products)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct NewProduct<'a> {
    pub sku: &'a str,
    pub item_name: &'a str,
    pub category_id: Option<i32>,
    pub cost_price: f64,
    pub selling_price: f64,
    pub tax_rate_id: Option<i32>,
    pub quantity_on_hand: i32,
    pub low_stock_threshold: Option<i32>,
    pub is_perishable: bool,
    pub expiration_date: Option<NaiveDateTime>,
}

#[derive(AsChangeset)]
#[diesel(table_name = crate::schema::products)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct UpdateProduct<'a> {
    pub sku: Option<&'a str>,
    pub item_name: Option<&'a str>,
    pub category_id: Option<Option<i32>>,
    pub cost_price: Option<f64>,
    pub selling_price: Option<f64>,
    pub quantity_on_hand: Option<i32>,
    pub low_stock_threshold: Option<Option<i32>>,
    pub is_perishable: Option<bool>,
    pub expiration_date: Option<Option<NaiveDateTime>>
}
