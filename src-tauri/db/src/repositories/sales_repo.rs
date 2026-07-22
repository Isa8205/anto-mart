use diesel::SqliteConnection;

use crate::{entities::NewPurchase, models::Purchase};

pub struct SalesRepository;

impl SalesRepository {
    // Get 
    pub fn create_purchase(sale_data: NewPurchase, conn: &mut SqliteConnection) -> Result<Purchase, diesel::result::Error> {
        unimplemented!();
    }
}
