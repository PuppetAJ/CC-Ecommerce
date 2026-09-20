-- Up Migration

-- First-party analytics, in the database we already run. No third party sees any of this, and
-- there is nothing here that identifies a person: `session` is a random id a tab makes for
-- itself and forgets when it closes, and no address or user agent is stored.
CREATE TABLE events (
  id         bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       text        NOT NULL,
  session    text        NOT NULL,
  path       text        NOT NULL,
  product_id integer     REFERENCES products (id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_name_valid CHECK (name IN ('view', 'product_view', 'add_to_cart', 'checkout_started', 'purchase')),
  CONSTRAINT events_session_length CHECK (char_length(session) BETWEEN 8 AND 64),
  CONSTRAINT events_path_length CHECK (char_length(path) <= 512)
);

-- Every dashboard read is "this event, over this window".
CREATE INDEX events_name_time_idx ON events (name, created_at DESC);
CREATE INDEX events_session_idx ON events (session, created_at);

-- Down Migration

DROP TABLE events;
