mod user;
mod inventory;
mod role;
mod sales;

pub use user::{NewUser, UpdateUser};
pub use inventory::{NewProduct, UpdateProduct, NewProductCategory, UpdateProductCategory};
pub use role::{NewRole, UpdateRole};
pub use sales::{NewPurchase, NewPurchaseItem};
