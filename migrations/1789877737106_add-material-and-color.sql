-- Up Migration

-- The prose in `materials` stays: it reads well and says things a tag cannot ("no visible
-- fixings"). These are the filterable facets derived from it, kept as arrays rather than
-- join tables because the vocabulary is small and fixed, and `&&` is exactly the filter
-- semantics wanted. A CHECK enforces the vocabulary the way a foreign key otherwise would.
ALTER TABLE products ADD COLUMN material_tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE products ADD COLUMN color text;

ALTER TABLE products ADD CONSTRAINT products_material_tags_valid CHECK (
  material_tags <@ ARRAY[
    'stoneware', 'porcelain', 'earthenware', 'stone',
    'oak', 'ash', 'elm', 'pine', 'reclaimed-timber',
    'steel', 'brass', 'glass', 'linen', 'wax'
  ]::text[]
);

ALTER TABLE products ADD CONSTRAINT products_color_valid CHECK (
  color IS NULL OR color IN ('white', 'cream', 'grey', 'black', 'blue', 'red', 'yellow', 'gold', 'terracotta', 'natural', 'mixed')
);

-- Overlap queries (`material_tags && ARRAY[...]`) need GIN, not btree.
CREATE INDEX products_material_tags_idx ON products USING gin (material_tags);
CREATE INDEX products_color_idx ON products (color) WHERE color IS NOT NULL;

-- Down Migration

DROP INDEX products_color_idx;
DROP INDEX products_material_tags_idx;
ALTER TABLE products DROP CONSTRAINT products_color_valid;
ALTER TABLE products DROP CONSTRAINT products_material_tags_valid;
ALTER TABLE products DROP COLUMN color;
ALTER TABLE products DROP COLUMN material_tags;
