use diesel::{QueryDsl, RunQueryDsl, SelectableHelper, SqliteConnection};

use crate::{models::{NewProductCategory, ProductCategory, UpdateProductCategory}, schema::product_categories};

pub struct ProductCategoryRepository;

impl ProductCategoryRepository {
    fn create(&mut self, data: NewProductCategory, conn: &mut SqliteConnection) -> Result<ProductCategory, diesel::result::Error> {
        diesel::insert_into(product_categories::table)
            .values(data)
            .returning(ProductCategory::as_returning())
            .get_result::<ProductCategory>(conn)
    }

    pub fn find_all(&mut self, conn: &mut SqliteConnection) -> Result<Vec<ProductCategory>, diesel::result::Error> {
        product_categories::table
            .select(ProductCategory::as_select())
            .load::<ProductCategory>(conn)
    }

    pub fn find_by_id(&mut self, id: i32, conn: &mut SqliteConnection) -> Result<ProductCategory, diesel::result::Error> {
        product_categories::table
            .find(id)
            .select(ProductCategory::as_select())
            .first::<ProductCategory>(conn)
    }

    pub fn update(&mut self, user_id: i32, changes: UpdateProductCategory, conn: &mut SqliteConnection) -> Result<ProductCategory, diesel::result::Error> {
        diesel::update(product_categories::table.find(user_id))
            .set(&changes)
            .returning(ProductCategory::as_select())
            .get_result::<ProductCategory>(conn)
    }

    pub fn delete(&mut self, user_id: i32, conn: &mut SqliteConnection) -> Result<usize, diesel::result::Error> {
        diesel::delete(product_categories::table.find(user_id))
            .execute(conn)
    }
}
