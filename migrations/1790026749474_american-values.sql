-- Up Migration

-- Three values a shopper can read, in the URL or on a badge, brought into line with the rest of
-- the site's spelling. Each vocabulary is a CHECK constraint, so it is restated with the new word
-- before the rows move to it.
ALTER TABLE products DROP CONSTRAINT products_color_valid;
UPDATE products SET color = 'gray' WHERE color = 'grey';
ALTER TABLE products ADD CONSTRAINT products_color_valid CHECK (
  color IS NULL OR color IN ('white', 'cream', 'gray', 'black', 'blue', 'red', 'yellow', 'gold', 'terracotta', 'natural', 'mixed')
);

ALTER TABLE products DROP CONSTRAINT products_material_tags_valid;
UPDATE products SET material_tags = array_replace(material_tags, 'reclaimed-timber', 'reclaimed-wood');
ALTER TABLE products ADD CONSTRAINT products_material_tags_valid CHECK (
  material_tags <@ ARRAY[
    'stoneware', 'porcelain', 'earthenware', 'stone',
    'oak', 'ash', 'elm', 'pine', 'walnut', 'reclaimed-wood',
    'steel', 'brass', 'glass', 'linen', 'wax'
  ]::text[]
);

ALTER TABLE orders DROP CONSTRAINT orders_status_valid;
UPDATE orders SET status = 'canceled' WHERE status = 'cancelled';
ALTER TABLE orders ADD CONSTRAINT orders_status_valid CHECK (status IN ('pending', 'paid', 'canceled'));

-- Down Migration

ALTER TABLE orders DROP CONSTRAINT orders_status_valid;
UPDATE orders SET status = 'cancelled' WHERE status = 'canceled';
ALTER TABLE orders ADD CONSTRAINT orders_status_valid CHECK (status IN ('pending', 'paid', 'cancelled'));

ALTER TABLE products DROP CONSTRAINT products_material_tags_valid;
UPDATE products SET material_tags = array_replace(material_tags, 'reclaimed-wood', 'reclaimed-timber');
ALTER TABLE products ADD CONSTRAINT products_material_tags_valid CHECK (
  material_tags <@ ARRAY[
    'stoneware', 'porcelain', 'earthenware', 'stone',
    'oak', 'ash', 'elm', 'pine', 'walnut', 'reclaimed-timber',
    'steel', 'brass', 'glass', 'linen', 'wax'
  ]::text[]
);

ALTER TABLE products DROP CONSTRAINT products_color_valid;
UPDATE products SET color = 'grey' WHERE color = 'gray';
ALTER TABLE products ADD CONSTRAINT products_color_valid CHECK (
  color IS NULL OR color IN ('white', 'cream', 'grey', 'black', 'blue', 'red', 'yellow', 'gold', 'terracotta', 'natural', 'mixed')
);
