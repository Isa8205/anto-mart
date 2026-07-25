use diesel::prelude::*;

use crate::db::{entities::NewPurchase, models::Purchase};
use crate::db::schema;

pub struct PurchaseRepository;

impl PurchaseRepository {
    pub fn create(&mut self, data: NewPurchase, conn: &mut SqliteConnection) -> Result<Purchase, diesel::result::Error> {
        diesel::insert_into(schema::purchases::table)
            .values(&data)
            .returning(Purchase::as_returning())
            .get_result::<Purchase>(conn)
    }

    pub fn find_by_id(&mut self, id: i32, conn: &mut SqliteConnection) -> Result<Purchase, diesel::result::Error> {
        schema::purchases::table
            .find(id)
            .get_result::<Purchase>(conn)
    }
}
