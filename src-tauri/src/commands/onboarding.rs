use std::fs;

use diesel::prelude::*;
use tauri::{AppHandle, Manager};

use crate::{
    DbState,
    commands::utils::get_business_config_path,
    db::{
        entities::{NewRole, NewUser},
        repositories::{RoleRepository, UserRepository},
        schema::app_metadata::{key, value},
    },
    dto::{OnboardingRequest, Response},
};

#[tauri::command]
pub fn complete_onboarding(data: OnboardingRequest, app: AppHandle) -> Response {
    let db_handle = app.state::<DbState>();
    let mut db_guard = db_handle.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    let business_conf_path = get_business_config_path(&app);

    // Save the business info into a json file
    let json_data = serde_json::to_string_pretty(&data.business).unwrap();
    fs::write(business_conf_path, json_data);

    // Create the Admin and Cashier roles
    let mut role_repo = RoleRepository;

    let admin_role = NewRole {
        role_name: "Admin".into(),
    };

    let cashier_role = NewRole {
        role_name: "Cashier".into(),
    };

    let created_admin_role = role_repo.create(admin_role, conn).unwrap();
    let _created_cashier_role = role_repo.create(cashier_role, conn).unwrap();

    // Register the admin user to the database
    let mut user_repo = UserRepository;

    let new_admin = NewUser {
        first_name: data.admin.first_name,
        last_name: data.admin.last_name,
        email: data.admin.email,
        phone: Some(data.admin.phone),
        password: data.admin.password,
        role: Some(1),
        avatar: None,
        mfa_enabled: false,
        mfa_method: None,
    };

    user_repo.create(new_admin, conn);

    // Set the 'onboarding_complete' metadata
    let _ = diesel::insert_into(crate::db::schema::app_metadata::table)
        .values((key.eq("onboarding_complete"), value.eq("true")))
        .execute(conn);

    Response {
        success: true,
        error: None,
    }
}

#[tauri::command]
pub fn is_onboarding_done(app: AppHandle) -> bool {
    use crate::db::schema::app_metadata::dsl::*;

    let db_handle = app.state::<DbState>();
    let mut db_guard = db_handle.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    app_metadata
        .filter(key.eq("onboarding_complete"))
        .select(value)
        .first::<String>(conn)
        .map(|v| v == "true")
        .unwrap_or(false)
}
