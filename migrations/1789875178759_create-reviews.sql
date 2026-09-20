-- Up Migration

-- One review per person per product, enforced by the primary key rather than by a check
-- in the action, so a double submit cannot create two.
CREATE TABLE reviews (
  user_id     text        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  product_id  integer     NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  rating      integer     NOT NULL,
  body        text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_body_length CHECK (char_length(body) BETWEEN 1 AND 2000)
);

CREATE INDEX reviews_product_idx ON reviews (product_id, created_at DESC);

-- Down Migration

DROP TABLE reviews;
