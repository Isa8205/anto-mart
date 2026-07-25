use diesel::associations::HasTable;
use diesel::prelude::*;

use crate::entities::NewPurchaseItem;
use crate::models::PurchaseItem;
use crate::schema::purchase_items::dsl::{purchase_items};

pub struct PurchaseItemRepository;

impl PurchaseItemRepository {
    pub fn create(&mut self, data: NewPurchaseItem, conn: &mut SqliteConnection) -> Result<PurchaseItem, diesel::result::Error> {
        diesel::insert_into(purchase_items)
            .values(&data)
            .returning(PurchaseItem::as_returning())
            .get_result::<PurchaseItem>(conn)
    }

    pub fn find_by_id(id: i32, conn: &mut SqliteConnection) -> Result<PurchaseItem, diesel::result::Error> {
        purchase_items::table()
            .find(id)
            .select(PurchaseItem::as_select())
            .get_result::<PurchaseItem>(conn)
    }
}
