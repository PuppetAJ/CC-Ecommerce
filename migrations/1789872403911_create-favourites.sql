-- Up Migration

-- A favourite belongs to an account, so there is no guest equivalent: the cart's cookie
-- trick would let a stale id read somebody else's list.
CREATE TABLE favourites (
  user_id     text        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  product_id  integer     NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

CREATE INDEX favourites_user_idx ON favourites (user_id, created_at DESC);

-- Down Migration

DROP TABLE favourites;
