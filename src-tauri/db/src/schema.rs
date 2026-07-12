// @generated automatically by Diesel CLI.

diesel::table! {
    permissions (id) {
        id -> Integer,
        perm_name -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    role_permissions (role_id, permission_id) {
        role_id -> Integer,
        permission_id -> Integer,
    }
}

diesel::table! {
    roles (id) {
        id -> Integer,
        role_name -> Text,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    users (id) {
        id -> Integer,
        first_name -> Text,
        last_name -> Text,
        email -> Text,
        phone -> Nullable<Text>,
        password -> Text,
        avatar -> Nullable<Text>,
        role -> Nullable<Integer>,
        mfa_enabled -> Bool,
        mfa_method -> Nullable<Text>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::joinable!(role_permissions -> permissions (permission_id));
diesel::joinable!(role_permissions -> roles (role_id));
diesel::joinable!(users -> roles (role));

diesel::allow_tables_to_appear_in_same_query!(permissions, role_permissions, roles, users,);
