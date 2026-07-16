use diesel::{Selectable, deserialize::Queryable, prelude::Insertable, query_builder::AsChangeset, sql_types::Timestamp};
use serde::Deserialize;

use crate::schema::roles;

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = roles)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct Role {
    pub id: i32,
    pub role_name: String,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = roles)]
pub struct NewRole {
    pub role_name: String
}

#[derive(AsChangeset)]
#[diesel(table_name = roles)]
pub struct UpdateRole {
    role_name: Option<String>
}
