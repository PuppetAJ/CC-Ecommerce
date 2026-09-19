-- Up Migration

-- Grouped specification rows, as {"Measurements": {"Weight": "1.2 kg"}, ...}. A json column
-- rather than columns because the useful fields differ by category: a lamp has a bulb
-- fitting, a stool has a seat height, and neither wants the other's empty column.
--
-- json, not jsonb, precisely because jsonb sorts keys and we want the groups and rows to
-- come back in the order they were written.
ALTER TABLE products ADD COLUMN specs json NOT NULL DEFAULT '{}'::json;

-- Down Migration

ALTER TABLE products DROP COLUMN specs;
