-- Up Migration

-- The trigram index behind the shop's search.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE users (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  email         text NOT NULL UNIQUE,
  email_verified boolean NOT NULL DEFAULT false,
  image         text,
  role          text NOT NULL DEFAULT 'customer',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_role_valid CHECK (role IN ('customer', 'admin'))
);

CREATE TABLE sessions (
  id         text PRIMARY KEY,
  user_id    text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token      text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sessions_user_idx ON sessions (user_id);

CREATE TABLE accounts (
  id            text PRIMARY KEY,
  user_id       text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  account_id    text NOT NULL,
  provider_id   text NOT NULL,
  access_token  text,
  refresh_token text,
  id_token      text,
  access_token_expires_at  timestamptz,
  refresh_token_expires_at timestamptz,
  scope      text,
  password   text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX accounts_user_idx ON accounts (user_id);
CREATE UNIQUE INDEX accounts_provider_idx ON accounts (provider_id, account_id);

CREATE TABLE verifications (
  id         text PRIMARY KEY,
  identifier text NOT NULL,
  value      text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX verifications_identifier_idx ON verifications (identifier);

CREATE TABLE products (
  id             integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  slug           text NOT NULL UNIQUE,
  name           text NOT NULL,
  description    text NOT NULL,
  category       text NOT NULL,
  price_cents    integer NOT NULL,
  sale_price_cents integer,
  stock_quantity integer NOT NULL DEFAULT 0,
  image_url      text,
  is_featured    boolean NOT NULL DEFAULT false,
  dimensions     text,
  materials      text,
  specs          json NOT NULL DEFAULT '{}'::json,
  material_tags  text[] NOT NULL DEFAULT '{}',
  color          text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_price_positive CHECK (price_cents >= 0),
  CONSTRAINT products_stock_positive CHECK (stock_quantity >= 0),
  CONSTRAINT products_sale_price_is_a_saving CHECK (
    sale_price_cents IS NULL OR (sale_price_cents > 0 AND sale_price_cents < price_cents)
  ),
  CONSTRAINT products_category_valid CHECK (
    category IN ('tableware', 'vases', 'lighting', 'furniture', 'textiles', 'storage')
  ),
  CONSTRAINT products_color_valid CHECK (
    color IS NULL OR color IN (
      'white', 'cream', 'gray', 'black', 'blue', 'red', 'yellow', 'gold', 'terracotta', 'natural', 'mixed'
    )
  ),
  CONSTRAINT products_material_tags_valid CHECK (
    material_tags <@ ARRAY[
      'stoneware', 'porcelain', 'earthenware', 'stone',
      'oak', 'ash', 'elm', 'pine', 'walnut', 'reclaimed-wood',
      'steel', 'brass', 'glass', 'linen', 'wax'
    ]
  )
);

CREATE INDEX products_category_idx ON products (category);
CREATE INDEX products_featured_idx ON products (is_featured) WHERE is_featured;
CREATE INDEX products_color_idx ON products (color) WHERE color IS NOT NULL;
CREATE INDEX products_material_tags_idx ON products USING gin (material_tags);
CREATE INDEX products_name_trgm_idx ON products USING gin (name gin_trgm_ops);
CREATE INDEX products_description_trgm_idx ON products USING gin (description gin_trgm_ops);

-- One cart per signed-in account; a guest's cart is found by the id in their cookie.
CREATE TABLE carts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    text UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
  cart_id    uuid NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  quantity   integer NOT NULL,
  PRIMARY KEY (cart_id, product_id),
  CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0)
);

CREATE TABLE orders (
  id          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id     text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  status      text NOT NULL DEFAULT 'pending',
  stripe_session_id text UNIQUE,
  total_cents integer NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  paid_at     timestamptz,
  CONSTRAINT orders_total_positive CHECK (total_cents >= 0),
  CONSTRAINT orders_status_valid CHECK (status IN ('pending', 'paid', 'canceled'))
);

CREATE INDEX orders_user_idx ON orders (user_id, created_at DESC);

-- The name, slug, image and price are copied, so an order still reads correctly after the
-- product behind it is edited or deleted.
CREATE TABLE order_items (
  id           integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  order_id     integer NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id   integer REFERENCES products (id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_slug text NOT NULL,
  image_url    text,
  quantity     integer NOT NULL,
  unit_price_cents integer NOT NULL,
  CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT order_items_price_positive CHECK (unit_price_cents >= 0)
);

CREATE INDEX order_items_order_idx ON order_items (order_id);

CREATE TABLE favorites (
  user_id    text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

CREATE INDEX favorites_user_idx ON favorites (user_id, created_at DESC);

-- One review per person per product, which is why the pair is the key.
CREATE TABLE reviews (
  user_id    text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  product_id integer NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  rating     integer NOT NULL,
  body       text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_body_length CHECK (char_length(body) BETWEEN 1 AND 2000)
);

CREATE INDEX reviews_product_idx ON reviews (product_id, created_at DESC);

CREATE TABLE review_votes (
  voter_id       text NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  review_user_id text NOT NULL,
  product_id     integer NOT NULL,
  helpful        boolean NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (voter_id, review_user_id, product_id),
  FOREIGN KEY (review_user_id, product_id) REFERENCES reviews (user_id, product_id) ON DELETE CASCADE,
  CONSTRAINT review_votes_not_own CHECK (voter_id <> review_user_id)
);

CREATE INDEX review_votes_review_idx ON review_votes (review_user_id, product_id);

CREATE TABLE events (
  id         bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name       text NOT NULL,
  session    text NOT NULL,
  path       text NOT NULL,
  product_id integer REFERENCES products (id) ON DELETE SET NULL,
  user_id    text REFERENCES users (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_name_valid CHECK (
    name IN ('view', 'product_view', 'add_to_cart', 'checkout_started', 'purchase')
  ),
  CONSTRAINT events_path_length CHECK (char_length(path) <= 512),
  CONSTRAINT events_session_length CHECK (char_length(session) BETWEEN 8 AND 64)
);

CREATE INDEX events_name_time_idx ON events (name, created_at DESC);
CREATE INDEX events_session_idx ON events (session, created_at);
CREATE INDEX events_user_time_idx ON events (user_id, created_at DESC) WHERE user_id IS NOT NULL;

CREATE TABLE messages (
  id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name       text NOT NULL,
  email      text NOT NULL,
  body       text NOT NULL,
  user_id    text REFERENCES users (id) ON DELETE SET NULL,
  answered   boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT messages_say_something CHECK (length(btrim(body)) >= 10)
);

CREATE INDEX messages_newest_idx ON messages (created_at DESC, id DESC);

CREATE TABLE subscribers (
  id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email      text NOT NULL UNIQUE,
  source     text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscribers_email_shape CHECK (email LIKE '%_@_%.__%'),
  CONSTRAINT subscribers_source_valid CHECK (source IN ('footer', 'landing'))
);

-- Counts attempts per action per caller; rows are short-lived and swept as they are read.
CREATE TABLE rate_limits (
  id           text PRIMARY KEY,
  key          text NOT NULL UNIQUE,
  count        integer NOT NULL,
  last_request bigint NOT NULL
);

-- Down Migration

DROP TABLE IF EXISTS rate_limits;
DROP TABLE IF EXISTS subscribers;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS review_votes;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS verifications;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;
DROP EXTENSION IF EXISTS pg_trgm;
