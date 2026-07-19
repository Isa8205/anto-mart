CREATE TABLE product_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  parent_id INTEGER,
  name VARCHAR UNIQUE NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description VARCHAR,
  image VARCHAR,
  is_active BOOLEAN NOT NULL DEFAULT 1,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  sku VARCHAR NOT NULL UNIQUE,
  item_name VARCHAR NOT NULL,
  category_id INTEGER,

  -- Financial Tracking
  cost_price DOUBLE NOT NULL,
  selling_price DOUBLE NOT NULL,
  tax_rate_id INTEGER,

  -- Stock Control
  quantity_on_hand INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER,

  -- Related to groceries
  is_perishable BOOLEAN NOT NULL DEFAULT 0,
  expiration_date DATETIME,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

CREATE TABLE product_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  alt_text VARCHAR(50),
  is_primary BOOLEAN NOT NULL DEFAULT 0,
  image VARCHAR,
  product_id INTEGER,

  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
