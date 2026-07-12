use std::env;

use diesel::prelude::*;
use dotenv::dotenv;

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();

    let db_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL not set!");

    SqliteConnection::establish(&db_url)
        .expect(&format!("Error connecting to {}!", &db_url))
}
