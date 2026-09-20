import 'server-only'
import { pool } from '../pool.ts'
import type { Product } from '../types.ts'

/** Returns true if it is now a favourite, false if the second press removed it. */
export async function toggleFavourite(userId: string, productId: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM favourites WHERE user_id = $1 AND product_id = $2', [
    userId,
    productId,
  ])
  if (rowCount) return false

  await pool.query('INSERT INTO favourites (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [
    userId,
    productId,
  ])
  return true
}

export async function listFavouriteIds(userId: string): Promise<number[]> {
  const { rows } = await pool.query<{ product_id: number }>('SELECT product_id FROM favourites WHERE user_id = $1', [
    userId,
  ])
  return rows.map((row) => row.product_id)
}

export async function listFavourites(userId: string): Promise<Product[]> {
  const { rows } = await pool.query<Product>(
    `SELECT p.* FROM favourites f JOIN products p ON p.id = f.product_id
     WHERE f.user_id = $1 ORDER BY f.created_at DESC`,
    [userId],
  )
  return rows
}
