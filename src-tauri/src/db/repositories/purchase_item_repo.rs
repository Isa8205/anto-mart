use diesel::prelude::*;

use crate::db::entities::NewPurchaseItem;
use crate::db::models::PurchaseItem;
use crate::db::schema;

pub struct PurchaseItemRepository;

impl PurchaseItemRepository {
    pub fn create(&mut self, data: NewPurchaseItem, conn: &mut SqliteConnection) -> Result<PurchaseItem, diesel::result::Error> {
        diesel::insert_into(schema::purchase_items::table)
            .values(&data)
            .returning(PurchaseItem::as_returning())
            .get_result::<PurchaseItem>(conn)
    }

    pub fn find_by_id(id: i32, conn: &mut SqliteConnection) -> Result<PurchaseItem, diesel::result::Error> {
        schema::purchase_items::table
            .find(id)
            .select(PurchaseItem::as_select())
            .get_result::<PurchaseItem>(conn)
    }
}
