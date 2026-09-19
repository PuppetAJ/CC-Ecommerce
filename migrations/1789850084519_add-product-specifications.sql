-- Up Migration

-- Both nullable: a product can exist before anyone has measured it, and the phase 8
-- admin creates products without forcing the field.
ALTER TABLE products ADD COLUMN dimensions text;
ALTER TABLE products ADD COLUMN materials  text;

-- Down Migration

ALTER TABLE products DROP COLUMN dimensions;
ALTER TABLE products DROP COLUMN materials;
