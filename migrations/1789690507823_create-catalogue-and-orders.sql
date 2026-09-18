-- Up Migration

CREATE TABLE products (
  id              integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug            text        NOT NULL UNIQUE,
  name            text        NOT NULL,
  description     text        NOT NULL,
  category        text        NOT NULL,
  -- Money is integer cents everywhere. Floats cannot represent 10.10 exactly.
  price_cents     integer     NOT NULL,
  stock_quantity  integer     NOT NULL DEFAULT 0,
  image_url       text,
  is_featured     boolean     NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_category_valid CHECK (category IN ('tableware', 'vases', 'lighting', 'furniture')),
  CONSTRAINT products_price_positive CHECK (price_cents >= 0),
  CONSTRAINT products_stock_positive CHECK (stock_quantity >= 0)
);

CREATE INDEX products_category_idx ON products (category);
CREATE INDEX products_featured_idx ON products (is_featured) WHERE is_featured;

-- user_id is nullable so a guest can hold a cart, keyed by a cookie. The foreign
-- key to the auth tables is added in phase 4, once those tables exist.
CREATE TABLE carts (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text        UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
  cart_id     uuid        NOT NULL REFERENCES carts (id) ON DELETE CASCADE,
  product_id  integer     NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  quantity    integer     NOT NULL,
  PRIMARY KEY (cart_id, product_id),
  CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0)
);

CREATE TABLE orders (
  id                 integer     GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id            text        NOT NULL,
  status             text        NOT NULL DEFAULT 'pending',
  -- Unique so a replayed Stripe webhook cannot create or pay an order twice.
  stripe_session_id  text        UNIQUE,
  total_cents        integer     NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now(),
  paid_at            timestamptz,
  CONSTRAINT orders_status_valid CHECK (status IN ('pending', 'paid', 'cancelled')),
  CONSTRAINT orders_total_positive CHECK (total_cents >= 0)
);

CREATE INDEX orders_user_idx ON orders (user_id, created_at DESC);

-- Name and price are copied, not joined. An order must still read correctly
-- after the product is renamed, repriced or deleted.
CREATE TABLE order_items (
  id                integer NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id          integer NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id        integer REFERENCES products (id) ON DELETE SET NULL,
  product_name      text    NOT NULL,
  product_slug      text    NOT NULL,
  image_url         text,
  quantity          integer NOT NULL,
  unit_price_cents  integer NOT NULL,
  CONSTRAINT order_items_quantity_positive CHECK (quantity > 0),
  CONSTRAINT order_items_price_positive CHECK (unit_price_cents >= 0)
);

CREATE INDEX order_items_order_idx ON order_items (order_id);

-- Down Migration

DROP TABLE order_items;
DROP TABLE orders;
DROP TABLE cart_items;
DROP TABLE carts;
DROP TABLE products;
