use chrono::NaiveDateTime;
use diesel::prelude::*;

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::purchases)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Purchase {
    pub id: i32,
    pub user_id: Option<i32>,
    pub purchase_number: String,
    pub total_amount: f64,
    pub payment_method: String,
    pub status: String,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = crate::schema::purchase_items)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct PurchaseItem {
    pub id: i32,
    pub purchase_id: i32,
    pub product_id: i32,
    pub unit_price: f64,
    pub quantity: i32,
    pub subtotal: f64,
    pub created_at: NaiveDateTime,
}
