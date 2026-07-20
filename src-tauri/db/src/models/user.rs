use diesel::{Selectable, deserialize::Queryable};
use serde::Serialize;

#[derive(Queryable, Selectable, Serialize, Debug)]
#[diesel(table_name = crate::schema::users)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct User {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub password: String,
    pub avatar: Option<String>,
    pub role: Option<i32>,
    pub mfa_enabled: bool,
    pub mfa_method: Option<String>,
}
