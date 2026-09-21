-- Up Migration

-- The newsletter signup. Stored rather than mailed, like the contact form: there is no mail
-- backend, and a field that quietly discards an address is worse than none.
CREATE TABLE subscribers (
  id         serial      PRIMARY KEY,
  email      text        NOT NULL UNIQUE,
  -- Where it was typed: 'footer' or 'landing'. Which prompt earns its place is worth knowing.
  source     text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscribers_email_shape CHECK (email LIKE '%_@_%.__%'),
  CONSTRAINT subscribers_source_valid CHECK (source IN ('footer', 'landing'))
);

-- Down Migration

DROP TABLE subscribers;
