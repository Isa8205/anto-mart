mod user;
mod inventory;
mod role;

pub use user::{NewUser, UpdateUser};
pub use inventory::{NewProduct, UpdateProduct, NewProductCategory, UpdateProductCategory};
pub use role::{NewRole, UpdateRole};
