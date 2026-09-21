-- Up Migration

-- The help page's contact form. Stored rather than mailed: there is no mail backend, and a form
-- that quietly discards what somebody typed is worse than showing them an address.
CREATE TABLE messages (
  id         serial      PRIMARY KEY,
  name       text        NOT NULL,
  email      text        NOT NULL,
  body       text        NOT NULL,
  -- Null for a signed-out sender, which is most of them.
  user_id    text        REFERENCES users (id) ON DELETE SET NULL,
  answered   boolean     NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT messages_say_something CHECK (length(btrim(body)) >= 10)
);

-- The admin list reads newest first, which is the only read this table has.
CREATE INDEX messages_newest_idx ON messages (created_at DESC, id DESC);

-- Down Migration

DROP TABLE messages;
