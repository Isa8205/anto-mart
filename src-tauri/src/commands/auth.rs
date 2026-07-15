use crate::DbState;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier, password_hash::SaltString};
use db::{models::{NewRole, NewUser, User, UserResponse}, repositories::{RoleRepository, UserRepository}};
use rand_core::OsRng;
use serde::Serialize;

#[derive(Serialize)]
pub struct Response {
    success: bool,
    error: Option<String>,
    user: Option<UserResponse>
}

#[tauri::command]
pub fn add_user(mut data: NewUser, state: tauri::State<'_, DbState>) -> Response {
    let mut db_guard = state.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(&data.password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    data.password = password_hash;

    let mut user_repo = UserRepository;

    match user_repo.create(data, conn) {
        Ok(user) => {
            dbg!(user);
            Response {
                success: true,
                error: None,
                user: None
            }
        }
        Err(e) => {
            println!("Encountered an error: {}", e.to_string());
            Response {
                success: false,
                error: Some(e.to_string()),
                user: None
            }
        }
    }
}

#[tauri::command]
pub fn add_role(data: NewRole, state: tauri::State<'_, DbState>) -> Response {
    let mut db_guard = state.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    let mut role_repo = RoleRepository;

    match role_repo.create(data, conn) {
        Ok(role) => {
            dbg!(&role);
            Response {
                success: true,
                error: None,
                user: None
            }
        },
        Err(e) => {
            Response {
                success: false,
                error: Some(e.to_string()),
                user: None
            }
        }
    }

}

#[tauri::command]
pub fn login(email: String, password: String, state: tauri::State<'_, DbState>) -> Response {
    let mut db_guard = state.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    let mut user_repo = UserRepository;
    match user_repo.find_by_email(email, conn) {
        Ok(user) => {
            let password_hash = PasswordHash::new(&user.password).unwrap();
            
            if !Argon2::default().verify_password(password.as_bytes(), &password_hash).is_ok() {
                Response {
                    success: false,
                    error: Some("Invalid email or password".to_string()),
                    user: None,
                }
            } else {
                Response {
                    success: true,
                    error: None,
                    user: Some(UserResponse::from(user))
                }
            }
        },
        Err(e) => {
            Response { success: false, error: Some(e.to_string()), user: None }
        }
    }

}
