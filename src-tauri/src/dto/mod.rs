mod user;
mod inventory;
mod api;
mod sales;

pub use inventory::{CreateProductCategoryRequest, CreateProductRequest, ProductResponse, ProductCategoryResponse};
pub use user::{CreateUserRequest, UserResponse};
pub use api::{Response, LoginResponse};
pub use sales::CreatePurchaseRequest;

