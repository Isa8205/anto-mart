use serde::{Deserialize, Serialize};
use db::models::User;
use ts_rs::TS;

#[derive(Deserialize, TS)]
#[ts(export)]
pub struct CreateUserRequest {
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub password: String, // Plain text from frontend, to be hashed!
    pub mfa_enabled: bool,
    pub mfa_method: Option<String>,
    pub role: Option<i32>,

    pub avatar: Option<AvatarPayload>,
}

#[derive(Deserialize, TS)]
pub struct AvatarPayload {
    pub name: String,
    pub bytes: Vec<u8>,
}

#[derive(Serialize, TS)]
#[ts(export)]
pub struct UserResponse {
    pub id: i32,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: Option<String>,
    pub avatar: Option<String>,
    pub role: Option<i32>,
    pub mfa_enabled: bool,
    pub mfa_method: Option<String>,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            mfa_enabled: user.mfa_enabled,
            mfa_method: user.mfa_method,
        }
    }
}
