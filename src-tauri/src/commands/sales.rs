use diesel::prelude::*;
use tauri::Manager;

use crate::{DbState, db::{entities::{NewPurchase, NewPurchaseItem}, models::Purchase, schema::{products, purchase_items, purchases}}, dto::CreatePurchaseRequest};

#[tauri::command]
pub fn process_purchase(data: CreatePurchaseRequest, app: tauri::AppHandle) -> Result<Purchase, diesel::result::Error> {
    let db_state = app.state::<DbState>();
    let mut db_guard = db_state.0.lock().unwrap();

    let conn = &mut db_guard.conn;

    // Perform everything in a transaction to ensure all or none guarantees.
    conn.transaction::<Purchase, diesel::result::Error, _>(|conn| {
        let mut calculated_total = 0.0;
        let mut items_to_insert = Vec::new();

        // 1. Generate a unique order number
        let order_num = format!("SL-{}", chrono::Utc::now().timestamp_millis());

        // 2. Fetch prices directly from DB (never trust frontend prices!)
        for item in &data.items {
            let (product_price, current_stock): (f64, i32) = products::table
                .find(item.product_id)
                .select((products::selling_price, products::quantity_on_hand))
                .first(conn)?;

            // Verify stock availability
            if current_stock < item.quantity {
                return Err(diesel::result::Error::RollbackTransaction);
            }

            let line_subtotal = product_price * (item.quantity as f64);
            calculated_total += line_subtotal;

            // Deduct stock immediately
            diesel::update(products::table.find(item.product_id))
                .set(products::quantity_on_hand.eq(products::quantity_on_hand - item.quantity))
                .execute(conn)?;

            // Queue up the line item model
            items_to_insert.push((item.product_id, product_price, item.quantity, line_subtotal));
        }

        // 3. Insert Order Header
        let new_purchase = NewPurchase {
            user_id: data.user_id,
            purchase_number: order_num,
            total_amount: calculated_total,
            payment_method: data.payment_method.into(),
            status: "COMPLETED".into(),
        };

        let created_purchase: Purchase = diesel::insert_into(purchases::table)
            .values(&new_purchase)
            .returning(Purchase::as_select())
            .get_result(conn)?;

        // 4. Insert all Line Items linked to the new order ID
        for (prod_id, price, qty, subtotal) in items_to_insert {
            let new_item = NewPurchaseItem {
                purchase_id: created_purchase.id,
                product_id: prod_id,
                unit_price: price,
                quantity: qty,
                subtotal,
            };

            diesel::insert_into(purchase_items::table)
                .values(&new_item)
                .execute(conn)?;
        }

        Ok(created_purchase)
    })
}
