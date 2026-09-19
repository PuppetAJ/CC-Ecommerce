-- Up Migration

-- Grouped rows as {"Measurements": {"Weight": "1.2 kg"}, ...}; json not jsonb, because jsonb sorts the keys.
ALTER TABLE products ADD COLUMN specs json NOT NULL DEFAULT '{}'::json;

-- Down Migration

ALTER TABLE products DROP COLUMN specs;
