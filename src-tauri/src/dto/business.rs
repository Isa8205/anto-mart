use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, TS)]
#[ts(export)]
pub struct CreateBusinessRequest {
    pub name: String,
    pub address: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub currency: String,
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