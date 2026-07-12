use std::{error::Error, path::Path};

use diesel::SqliteConnection;
use diesel::prelude::*;

pub struct Database {
    conn: SqliteConnection,
}

impl Database {
    pub fn open<P: AsRef<Path>>(path: P) -> Result<Self, Box<dyn Error>> {
        let conn = SqliteConnection::establish(
            path.as_ref().to_str().unwrap(),
        )?;

        Ok(Self { conn })
    }
}
