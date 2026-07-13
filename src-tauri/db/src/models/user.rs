use crate::schema::users;
use diesel::{Insertable, Selectable, deserialize::Queryable, query_builder::AsChangeset};

#[derive(Queryable, Selectable, Debug)]
#[diesel(table_name = users)]
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

#[derive(Insertable)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub password: String,
    pub avatar: Option<String>,
    pub role: Option<i32>,
    pub mfa_enabled: bool,
    pub mfa_method: Option<String>
}

#[derive(AsChangeset)]
#[diesel(table_name = users)]
pub struct UpdateUser {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub phone: Option<Option<String>>,
    pub avatar: Option<Option<String>>,
    pub mfa_enabled: Option<bool>,
    pub mfa_method: Option<Option<String>>
}
