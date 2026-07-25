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
    product_categories (id) {
        id -> Integer,
        parent_id -> Nullable<Integer>,
        name -> Text,
        slug -> Text,
        description -> Nullable<Text>,
        image -> Nullable<Text>,
        is_active -> Bool,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    product_images (id) {
        id -> Integer,
        alt_text -> Nullable<Text>,
        is_primary -> Bool,
        image -> Nullable<Text>,
        product_id -> Nullable<Integer>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    products (id) {
        id -> Integer,
        sku -> Text,
        item_name -> Text,
        category_id -> Nullable<Integer>,
        cost_price -> Double,
        selling_price -> Double,
        tax_rate_id -> Nullable<Integer>,
        quantity_on_hand -> Integer,
        low_stock_threshold -> Nullable<Integer>,
        is_perishable -> Bool,
        expiration_date -> Nullable<Timestamp>,
        created_at -> Timestamp,
        updated_at -> Timestamp,
    }
}

diesel::table! {
    purchase_items (id) {
        id -> Integer,
        purchase_id -> Integer,
        product_id -> Integer,
        unit_price -> Double,
        quantity -> Integer,
        subtotal -> Double,
        created_at -> Timestamp,
    }
}

diesel::table! {
    purchases (id) {
        id -> Integer,
        user_id -> Nullable<Integer>,
        purchase_number -> Text,
        total_amount -> Double,
        payment_method -> Text,
        status -> Text,
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

diesel::joinable!(product_images -> products (product_id));
diesel::joinable!(products -> product_categories (category_id));
diesel::joinable!(purchase_items -> products (product_id));
diesel::joinable!(purchases -> users (user_id));
diesel::joinable!(role_permissions -> permissions (permission_id));
diesel::joinable!(role_permissions -> roles (role_id));
diesel::joinable!(users -> roles (role));

diesel::allow_tables_to_appear_in_same_query!(
    permissions,
    product_categories,
    product_images,
    products,
    purchase_items,
    purchases,
    role_permissions,
    roles,
    users,
);
