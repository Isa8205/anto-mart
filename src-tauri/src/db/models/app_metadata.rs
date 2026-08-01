use diesel::prelude::*;
use chrono::NaiveDateTime;

#[derive(HasQuery)]
#[diesel(table_name = crate::db::schema::app_metadata)]
pub struct AppMetadata {
    key: String,
    value: String,
    updated_at: NaiveDateTime,
}
