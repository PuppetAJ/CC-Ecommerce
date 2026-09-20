-- Up Migration

-- Reviews have no id of their own: (user_id, product_id) is the key, so a vote carries both.
CREATE TABLE review_votes (
  voter_id       text        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  review_user_id text        NOT NULL,
  product_id     integer     NOT NULL,
  helpful        boolean     NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (voter_id, review_user_id, product_id),
  FOREIGN KEY (review_user_id, product_id) REFERENCES reviews (user_id, product_id) ON DELETE CASCADE,
  -- In the table rather than the action, so no code path can vote a review up on its own behalf.
  CONSTRAINT review_votes_not_own CHECK (voter_id <> review_user_id)
);

-- Counting votes per review is the read this table exists for.
CREATE INDEX review_votes_review_idx ON review_votes (review_user_id, product_id);

-- Down Migration

DROP TABLE review_votes;
