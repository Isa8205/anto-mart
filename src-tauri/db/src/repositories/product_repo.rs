use diesel::{QueryDsl, RunQueryDsl, SelectableHelper, SqliteConnection};

use crate::{models::{NewProduct, Product, UpdateProduct}, schema::products};

pub struct ProductRepository;

impl ProductRepository {
    fn create(&mut self, data: NewProduct, conn: &mut SqliteConnection) -> Result<Product, diesel::result::Error> {
        diesel::insert_into(products::table)
            .values(data)
            .returning(Product::as_returning())
            .get_result::<Product>(conn)
    }

    pub fn find_all(&mut self, conn: &mut SqliteConnection) -> Result<Vec<Product>, diesel::result::Error> {
        products::table
            .select(Product::as_select())
            .load::<Product>(conn)
    }

    pub fn find_by_id(&mut self, id: i32, conn: &mut SqliteConnection) -> Result<Product, diesel::result::Error> {
        products::table
            .find(id)
            .select(Product::as_select())
            .first::<Product>(conn)
    }

    pub fn update(&mut self, user_id: i32, changes: UpdateProduct, conn: &mut SqliteConnection) -> Result<Product, diesel::result::Error> {
        diesel::update(products::table.find(user_id))
            .set(&changes)
            .returning(Product::as_select())
            .get_result::<Product>(conn)
    }

    pub fn delete(&mut self, user_id: i32, conn: &mut SqliteConnection) -> Result<usize, diesel::result::Error> {
        diesel::delete(products::table.find(user_id))
            .execute(conn)
    }
}
