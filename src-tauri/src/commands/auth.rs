use crate::{
    DbState, dto::{
        CreateUserRequest, LoginResponse, Response, UserResponse,
    }, utils::media::save_file,
};
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier, password_hash::SaltString};
use db::{
    entities::{NewRole, NewUser},
    repositories::{RoleRepository, UserRepository},
};
use rand_core::OsRng;
use tauri::Manager;

#[tauri::command]
pub fn add_user(data: CreateUserRequest, app: tauri::AppHandle) -> Response {
    let db_state = app.state::<DbState>();
    let mut db_guard = db_state.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    // Password hashing
    let salt = SaltString::generate(&mut OsRng);
    let password_hash = Argon2::default()
        .hash_password(&data.password.as_bytes(), &salt)
        .unwrap()
        .to_string();

    // Save avatar and get relative path
    let avatar_path = match data.avatar {
        Some(avatar_data) => {
            if let Ok(save_path) = save_file(&app, "avatars", &avatar_data.name, &avatar_data.bytes)
            {
                Some(save_path)
            } else {
                // TODO: Find a way to log the errors related to file saving
                None
            }
        }
        None => None,
    };

    // Construct a NewUser instance for storing
    let new_user = NewUser {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        password: password_hash,
        avatar: avatar_path,
        role: data.role,
        mfa_enabled: data.mfa_enabled,
        mfa_method: data.mfa_method,
    };

    let mut user_repo = UserRepository;

    match user_repo.create(new_user, conn) {
        Ok(user) => {
            dbg!(user);
            Response {
                success: true,
                error: None,
            }
        }
        Err(e) => {
            println!("Encountered an error: {}", e.to_string());
            Response {
                success: false,
                error: Some(e.to_string()),
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
            }
        }
        Err(e) => Response {
            success: false,
            error: Some(e.to_string()),
        },
    }
}

#[tauri::command]
pub fn login(email: String, password: String, state: tauri::State<'_, DbState>) -> LoginResponse {
    let mut db_guard = state.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    let mut user_repo = UserRepository;
    match user_repo.find_by_email(email, conn) {
        Ok(user) => {
            let password_hash = PasswordHash::new(&user.password).unwrap();

            if !Argon2::default()
                .verify_password(password.as_bytes(), &password_hash)
                .is_ok()
            {
                LoginResponse {
                    status: "INVALID_CREDENTIALS".into(),
                    user: None,
                }
            } else {
                LoginResponse {
                    status: "LOGIN_SUCCESS".into(),
                    user: Some(UserResponse::from(user)),
                }
            }
        }
        Err(_e) => LoginResponse {
            status: "APP_ERROR".into(),
            user: None,
        },
    }
}
