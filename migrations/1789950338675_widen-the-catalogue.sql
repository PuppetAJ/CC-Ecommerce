-- Up Migration

-- The shop makes more than it sold: linens and things to keep things in. Both vocabularies are
-- CHECK constraints rather than lookup tables, so widening one means restating it.
ALTER TABLE products DROP CONSTRAINT products_category_valid;
ALTER TABLE products ADD CONSTRAINT products_category_valid CHECK (
  category IN ('tableware', 'vases', 'lighting', 'furniture', 'textiles', 'storage')
);

ALTER TABLE products DROP CONSTRAINT products_material_tags_valid;
ALTER TABLE products ADD CONSTRAINT products_material_tags_valid CHECK (
  material_tags <@ ARRAY[
    'stoneware', 'porcelain', 'earthenware', 'stone',
    'oak', 'ash', 'elm', 'pine', 'walnut', 'reclaimed-timber',
    'steel', 'brass', 'glass', 'linen', 'wax'
  ]::text[]
);

-- Down Migration

ALTER TABLE products DROP CONSTRAINT products_material_tags_valid;
ALTER TABLE products ADD CONSTRAINT products_material_tags_valid CHECK (
  material_tags <@ ARRAY[
    'stoneware', 'porcelain', 'earthenware', 'stone',
    'oak', 'ash', 'elm', 'pine', 'reclaimed-timber',
    'steel', 'brass', 'glass', 'linen', 'wax'
  ]::text[]
);

ALTER TABLE products DROP CONSTRAINT products_category_valid;
ALTER TABLE products ADD CONSTRAINT products_category_valid CHECK (
  category IN ('tableware', 'vases', 'lighting', 'furniture')
);
