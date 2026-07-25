use diesel::prelude::*;

use crate::db::schema;

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = schema::roles)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Role {
    pub id: i32,
    pub role_name: String,
}
