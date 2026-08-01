use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
pub struct BusinessInfoRequest {
    pub name: String,
    pub county: String,
    pub phone: String,
    pub email: String,
}

#[derive(Debug, Deserialize, Serialize, TS)]
pub struct UserInfoRequest {
    pub first_name: String,
    pub last_name: String,
    pub username: String,
    pub email: String,
    pub phone: String,
    pub password: String,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export)]
pub struct OnboardingRequest {
    pub business: BusinessInfoRequest,
    pub admin: UserInfoRequest,
}

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export)]
pub struct BusinessResponse {
    pub name: String,
    pub address: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub currency: String,
}
