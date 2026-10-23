CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY, name TEXT NOT NULL, icon TEXT, tagline TEXT, c1 TEXT, c2 TEXT,
  sort SERIAL  -- thay cho rowid của SQLite, để giữ đúng thứ tự danh mục
);
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY, base TEXT, cat TEXT NOT NULL REFERENCES categories(slug),
  name TEXT NOT NULL, price INTEGER NOT NULL, sale INTEGER NOT NULL DEFAULT 0, out_of_stock INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_products_cat ON products(cat);
ALTER TABLE products ADD COLUMN IF NOT EXISTS img TEXT;
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY, slug TEXT UNIQUE NOT NULL, title TEXT NOT NULL,
  published TEXT NOT NULL, summary TEXT, body TEXT NOT NULL, c1 TEXT, c2 TEXT
);
-- uid = Firebase UID
CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY, name TEXT, email TEXT, avatar TEXT, provider TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY, user_uid TEXT REFERENCES users(uid),
  name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  user_uid TEXT,
  name TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, note TEXT,
  items TEXT NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
