use db::types::PaymentMethod;
use serde::Deserialize;
use ts_rs::TS;

#[derive(Deserialize, TS)]
pub struct PurchaseItem {
    pub product_id: i32,
    pub quantity: i32
}

#[derive(Deserialize, TS)]
#[ts(export)]
pub struct CreatePurchaseRequest {
    pub user_id: i32,
    pub payment_method: PaymentMethod,
    pub items: Vec<PurchaseItem>,
}
