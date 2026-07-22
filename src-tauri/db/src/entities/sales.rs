use diesel::prelude::*;

#[derive(Insertable)]
#[diesel(table_name = crate::schema::purchases)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct NewPurchase {
    pub user_id: i32,
    pub purchase_number: String,
    pub total_amount: f64,
    pub payment_method: String,
    pub status: String,
}

#[derive(Insertable)]
#[diesel(table_name = crate::schema::purchase_items)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct NewPurchaseItem {
    pub purchase_id: i32,
    pub product_id: i32,
    pub unit_price: f64,
    pub quantity: i32,
    pub subtotal: f64,
}
