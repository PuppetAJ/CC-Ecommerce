-- Up Migration

-- Null means not on sale. Every query prices with COALESCE(sale_price_cents, price_cents),
-- so there is one effective price and no way to charge the wrong one.
ALTER TABLE products ADD COLUMN sale_price_cents integer;

ALTER TABLE products ADD CONSTRAINT products_sale_price_valid
  CHECK (sale_price_cents IS NULL OR (sale_price_cents >= 0 AND sale_price_cents < price_cents));

-- Down Migration

ALTER TABLE products DROP CONSTRAINT products_sale_price_valid;
ALTER TABLE products DROP COLUMN sale_price_cents;
