-- Up Migration

-- Better Auth's own tables. It would create these itself with camelCase names, but
-- the model and field mapping in src/lib/auth/options.ts renames them to match the
-- rest of the schema; "user" is also a reserved word, so the table is "users".
CREATE TABLE users (
  id              text        PRIMARY KEY,
  name            text        NOT NULL,
  email           text        NOT NULL UNIQUE,
  email_verified  boolean     NOT NULL DEFAULT false,
  image           text,
  role            text        NOT NULL DEFAULT 'customer',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_role_valid CHECK (role IN ('customer', 'admin'))
);

CREATE TABLE sessions (
  id          text        PRIMARY KEY,
  user_id     text        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token       text        NOT NULL UNIQUE,
  expires_at  timestamptz NOT NULL,
  ip_address  text,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX sessions_user_idx ON sessions (user_id);

-- One row per sign-in method. The password column is only filled for the
-- 'credential' provider; a Google account leaves it null and stores tokens.
CREATE TABLE accounts (
  id                        text        PRIMARY KEY,
  user_id                   text        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  account_id                text        NOT NULL,
  provider_id               text        NOT NULL,
  access_token              text,
  refresh_token             text,
  id_token                  text,
  access_token_expires_at   timestamptz,
  refresh_token_expires_at  timestamptz,
  scope                     text,
  password                  text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX accounts_user_idx ON accounts (user_id);
CREATE UNIQUE INDEX accounts_provider_idx ON accounts (provider_id, account_id);

CREATE TABLE verifications (
  id          text        PRIMARY KEY,
  identifier  text        NOT NULL,
  value       text        NOT NULL,
  expires_at  timestamptz NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX verifications_identifier_idx ON verifications (identifier);

-- rate_limit.storage is 'database', so the counters survive a restart and are
-- shared by every instance. last_request is epoch milliseconds, hence bigint.
CREATE TABLE rate_limits (
  id            text   PRIMARY KEY,
  key           text   NOT NULL UNIQUE,
  count         integer NOT NULL,
  last_request  bigint NOT NULL
);

-- Deferred from the first migration, which could not reference tables that did
-- not exist yet. A real store would anonymise orders instead of cascading them.
ALTER TABLE carts  ADD CONSTRAINT carts_user_fkey  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT orders_user_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- Down Migration

ALTER TABLE orders DROP CONSTRAINT orders_user_fkey;
ALTER TABLE carts  DROP CONSTRAINT carts_user_fkey;
DROP TABLE rate_limits;
DROP TABLE verifications;
DROP TABLE accounts;
DROP TABLE sessions;
DROP TABLE users;
