use serde::Serialize;
use ts_rs::TS;

use crate::dto::UserResponse;

#[derive(Serialize, TS)]
#[ts(export)]
pub struct Response {
    pub success: bool,
    pub error: Option<String>,
}

#[derive(Serialize, TS)]
#[ts(export)]
pub struct LoginResponse {
    pub status: String,
    pub user: Option<UserResponse>
}
