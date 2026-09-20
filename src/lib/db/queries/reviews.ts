import 'server-only'
import { pool } from '../pool.ts'

export type Review = {
  user_id: string
  author: string
  rating: number
  body: string
  created_at: Date
}

export type ReviewSummary = { count: number; average: number }

export async function listReviews(productId: number): Promise<Review[]> {
  const { rows } = await pool.query<Review>(
    `SELECT r.user_id, u.name AS author, r.rating, r.body, r.created_at
     FROM reviews r JOIN users u ON u.id = r.user_id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
    [productId],
  )
  return rows
}

export async function summariseReviews(productId: number): Promise<ReviewSummary> {
  const { rows } = await pool.query<{ count: string; average: string | null }>(
    'SELECT count(*) AS count, avg(rating) AS average FROM reviews WHERE product_id = $1',
    [productId],
  )
  return { count: Number(rows[0].count), average: Number(rows[0].average ?? 0) }
}

/** Upsert, so a second submission edits rather than being refused or duplicated. */
export async function saveReview(userId: string, productId: number, rating: number, body: string): Promise<void> {
  await pool.query(
    `INSERT INTO reviews (user_id, product_id, rating, body) VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, product_id) DO UPDATE SET rating = EXCLUDED.rating, body = EXCLUDED.body, created_at = now()`,
    [userId, productId, rating, body],
  )
}

export async function getOwnReview(userId: string, productId: number): Promise<Review | null> {
  const { rows } = await pool.query<Review>(
    `SELECT r.user_id, u.name AS author, r.rating, r.body, r.created_at
     FROM reviews r JOIN users u ON u.id = r.user_id
     WHERE r.user_id = $1 AND r.product_id = $2`,
    [userId, productId],
  )
  return rows[0] ?? null
}

/** Ratings for a whole grid in one query, rather than one per tile. */
export async function summariseMany(productIds: number[]): Promise<Map<number, ReviewSummary>> {
  if (productIds.length === 0) return new Map()

  const { rows } = await pool.query<{ product_id: number; count: string; average: string }>(
    `SELECT product_id, count(*) AS count, avg(rating) AS average
     FROM reviews WHERE product_id = ANY($1) GROUP BY product_id`,
    [productIds],
  )
  return new Map(rows.map((row) => [row.product_id, { count: Number(row.count), average: Number(row.average) }]))
}
