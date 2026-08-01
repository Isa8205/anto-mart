pub mod user;
pub mod inventory;
pub mod api;
pub mod sales;
pub mod onboarding;

pub use inventory::{CreateProductCategoryRequest, CreateProductRequest, ProductResponse, ProductCategoryResponse};
pub use user::{CreateUserRequest, UserResponse};
pub use api::{Response, LoginResponse};
pub use sales::CreatePurchaseRequest;
pub use onboarding::{OnboardingRequest, BusinessResponse};

