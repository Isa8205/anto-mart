use diesel::{Selectable, deserialize::Queryable, prelude::Insertable, sql_types::Timestamp};

use crate::schema::roles;

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = roles)]
pub struct Role {
    pub id: i32,
    pub role_name: String,
    pub created_at: Timestamp,
    pub updated_at: Timestamp
}

#[derive(Insertable)]
#[diesel(table_name = roles)]
pub struct NewRole {
    pub role_name: String
}
