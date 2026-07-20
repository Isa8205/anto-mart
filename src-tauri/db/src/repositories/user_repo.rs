use diesel::prelude::*;

use crate::models::User;
use crate::entities::{NewUser, UpdateUser};
use crate::schema::users;

pub struct UserRepository;

impl UserRepository {
    pub fn create(&mut self, data: NewUser, conn: &mut SqliteConnection) -> Result<User, diesel::result::Error> {

        diesel::insert_into(users::table)
            .values(&data)
            .returning(User::as_returning())
            .get_result::<User>(conn)
    }

    pub fn find_all(&mut self, conn: &mut SqliteConnection) -> Result<Vec<User>, diesel::result::Error> {
        users::table
            .select(User::as_select())
            .load::<User>(conn)
    }

    pub fn find_by_id(&mut self, id: i32, conn: &mut SqliteConnection) -> Result<User, diesel::result::Error> {
        users::table
            .find(id)
            .select(User::as_select())
            .first::<User>(conn)
    }

    pub fn find_by_email(&mut self, given_email: String, conn: &mut SqliteConnection) -> Result<User, diesel::result::Error> {
        use crate::schema::users::dsl::email;

        users::table
            .filter(email.eq(given_email))
            .select(User::as_select())
            .first::<User>(conn)
    }

    pub fn update(&mut self, user_id: i32, changes: UpdateUser, conn: &mut SqliteConnection) -> Result<User, diesel::result::Error> {
        diesel::update(users::table.find(user_id))
            .set(&changes)
            .returning(User::as_select())
            .get_result::<User>(conn)
    }

    pub fn delete(&mut self, user_id: i32, conn: &mut SqliteConnection) -> Result<usize, diesel::result::Error> {
        diesel::delete(users::table.find(user_id))
            .execute(conn)
    }
}
