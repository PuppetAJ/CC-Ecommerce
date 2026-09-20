-- Up Migration

-- American spelling throughout, since that is the audience.
ALTER TABLE favourites RENAME TO favorites;
ALTER INDEX favourites_user_idx RENAME TO favorites_user_idx;
ALTER TABLE favorites RENAME CONSTRAINT favourites_user_id_fkey TO favorites_user_id_fkey;
ALTER TABLE favorites RENAME CONSTRAINT favourites_product_id_fkey TO favorites_product_id_fkey;

-- Down Migration

ALTER TABLE favorites RENAME CONSTRAINT favorites_product_id_fkey TO favourites_product_id_fkey;
ALTER TABLE favorites RENAME CONSTRAINT favorites_user_id_fkey TO favourites_user_id_fkey;
ALTER INDEX favorites_user_idx RENAME TO favourites_user_idx;
ALTER TABLE favorites RENAME TO favourites;
