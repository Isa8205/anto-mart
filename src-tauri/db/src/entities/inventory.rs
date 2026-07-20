use chrono::NaiveDateTime;
use diesel::prelude::*;


// ==================================
// Product Category
// ==================================
#[derive(Insertable)]
#[diesel(table_name = crate::schema::product_categories)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct NewProductCategory<'a> {
    pub parent_id: Option<i32>,
    pub name: &'a str,
    pub slug: &'a str,
    pub description: Option<String>,
    pub image: Option<String>,
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


// ==================================
// Products
// ==================================
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
