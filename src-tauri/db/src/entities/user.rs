use diesel::{prelude::*, query_builder::AsChangeset};
use serde::Deserialize;


#[derive(Insertable, Deserialize)]
#[diesel(table_name = crate::schema::users)]
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
#[diesel(table_name = crate::schema::users)]
pub struct UpdateUser {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub phone: Option<Option<String>>,
    pub avatar: Option<Option<String>>,
    pub mfa_enabled: Option<bool>,
    pub mfa_method: Option<Option<String>>
}
