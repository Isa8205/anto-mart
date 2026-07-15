use diesel::{
    QueryDsl,
    RunQueryDsl,
    SelectableHelper,
    SqliteConnection,
};

use crate::{
    models::role::{NewRole, Role, UpdateRole}, schema::roles,
};

pub struct RoleRepository;

impl RoleRepository {
    pub fn create(data: NewRole, conn: &mut SqliteConnection) -> Result<Role, diesel::result::Error> {
        diesel::insert_into(roles::table)
            .values(&data)
            .returning(Role::as_returning())
            .get_result::<Role>(conn)
    }

    pub fn find_all(&mut self, conn: &mut SqliteConnection) -> Result<Vec<Role>, diesel::result::Error> {
        roles::table
            .select(Role::as_select())
            .load::<Role>(conn)
    }

    pub fn find_by_id(&mut self, id: i32, conn: &mut SqliteConnection) -> Result<Role, diesel::result::Error> {
        roles::table
            .find(id)
            .select(Role::as_select())
            .first::<Role>(conn)
    }

    pub fn update(&mut self, id: i32, changes: UpdateRole, conn: &mut SqliteConnection) -> Result<Role, diesel::result::Error> {
        diesel::update(roles::table.find(id))
            .set(&changes)
            .returning(Role::as_returning())
            .get_result::<Role>(conn)
    }

    pub fn delete(&mut self, id: i32, conn: &mut SqliteConnection) -> Result<usize, diesel::result::Error> {
        diesel::delete(roles::table.find(id))
            .execute(conn)
    }
}
