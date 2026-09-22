-- Up Migration

-- Null means we made it. The rest name one of the workshops whose work we sell.
ALTER TABLE products ADD COLUMN made_by text;

ALTER TABLE products ADD CONSTRAINT products_made_by_valid CHECK (
  made_by IS NULL OR made_by IN ('kestrel-glass', 'rosedale-weaving', 'fennimore-wax')
);

-- Down Migration

ALTER TABLE products DROP CONSTRAINT products_made_by_valid;
ALTER TABLE products DROP COLUMN made_by;
