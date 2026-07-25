use diesel::prelude::*;
use serde::Deserialize;

use crate::db::schema;


#[derive(Insertable, Deserialize)]
#[diesel(table_name = schema::roles)]
pub struct NewRole {
    pub role_name: String
}

#[derive(AsChangeset)]
#[diesel(table_name = schema::roles)]
pub struct UpdateRole {
    role_name: Option<String>
}
