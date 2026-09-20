-- Up Migration

-- Who, when they are signed in. This is first-party account data, not a tracking identifier:
-- it exists because somebody chose to have an account, and it is set from the session on the
-- server, never from anything the browser claims.
ALTER TABLE events ADD COLUMN user_id text REFERENCES users (id) ON DELETE SET NULL;

-- Retention reads are "this account, over this window".
CREATE INDEX events_user_time_idx ON events (user_id, created_at DESC) WHERE user_id IS NOT NULL;

-- Down Migration

DROP INDEX events_user_time_idx;
ALTER TABLE events DROP COLUMN user_id;
