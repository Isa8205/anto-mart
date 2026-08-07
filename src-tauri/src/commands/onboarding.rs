use std::fs;

use argon2::{Argon2, PasswordHasher, password_hash::SaltString};
use diesel::prelude::*;
use rand_core::OsRng;
use tauri::{AppHandle, Manager};

use crate::{
    DbState,
    commands::utils::get_business_config_path,
    db::{
        entities::{NewRole, NewUser},
        repositories::{RoleRepository, UserRepository},
    },
    dto::OnboardingRequest,
};

#[tauri::command]
pub fn complete_onboarding(data: OnboardingRequest, app: AppHandle) -> Result<(), String> {
    let admin = &data.admin;
    if admin.first_name.trim().is_empty()
        || admin.last_name.trim().is_empty()
        || admin.email.trim().is_empty()
        || admin.password.trim().is_empty()
    {
        return Err("Required fields (first_name, last_name, email, phone, password) cannot be empty".into());
    }

    // Save the business info into a json file
    let business_conf_path = get_business_config_path(&app);

    let json_data = serde_json::to_string_pretty(&data.business).unwrap();
    fs::write(business_conf_path, json_data)
        .map_err(|e| format!("Failed to save write business config: {}", e.to_string()))?;

    // Generate the hash before the db handle to reduce db lock time
    let raw_pass = data.admin.password.clone();
    let salt = SaltString::generate(&mut OsRng);
    let hashed_password = Argon2::default()
        .hash_password(raw_pass.as_bytes(), &salt)
        .unwrap()
        .to_string();

    let db_handle = app.state::<DbState>();
    let mut db_guard = db_handle.0.lock().unwrap();
    let conn = &mut db_guard.conn;

    conn.transaction::<(), diesel::result::Error, _>(|conn| {
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

        let phone_option = if !admin.phone.trim().is_empty() {
            Some(admin.phone.trim().to_string())
        } else {
            None
        };

        let new_admin = NewUser {
            first_name: admin.first_name.trim().to_string(),
            last_name: admin.last_name.trim().to_string(),
            email: admin.email.trim().to_string(),
            phone: phone_option,
            password: hashed_password,
            role: Some(created_admin_role.id),
            avatar: None,
            mfa_enabled: false,
            mfa_method: None,
        };

        user_repo.create(new_admin, conn)?;

        // Set the 'onboarding_complete' metadata
        use crate::db::schema::app_metadata::dsl::*;

        diesel::insert_into(crate::db::schema::app_metadata::table)
            .values((key.eq("onboarding_complete"), value.eq("true")))
            .execute(conn)?;

        Ok(())
    })
    .map_err(|e| format!("Onboarding transaction failed: {}", e))?;

    Ok(())
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
