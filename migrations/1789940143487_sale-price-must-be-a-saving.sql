-- Up Migration

-- An empty form field arrived as 0 rather than NULL, so "no sale" was stored as "a sale at
-- $0.00" and COALESCE made those products free. Fixed in the action; enforced here so no
-- other code path can do it again.
UPDATE products SET sale_price_cents = NULL WHERE sale_price_cents IS NOT NULL AND sale_price_cents <= 0;

ALTER TABLE products ADD CONSTRAINT products_sale_price_is_a_saving CHECK (
  sale_price_cents IS NULL OR (sale_price_cents > 0 AND sale_price_cents < price_cents)
);

-- Down Migration

ALTER TABLE products DROP CONSTRAINT products_sale_price_is_a_saving;
