-- Up Migration

-- A leading wildcard is unindexable by btree, so `name ILIKE '%oak%'` scanned every row.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX products_name_trgm_idx ON products USING gin (name gin_trgm_ops);
CREATE INDEX products_description_trgm_idx ON products USING gin (description gin_trgm_ops);

-- Down Migration

DROP INDEX products_description_trgm_idx;
DROP INDEX products_name_trgm_idx;
