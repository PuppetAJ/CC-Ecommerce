import 'server-only'
import { pool } from '../pool.ts'
import type { Category, Product } from '../types.ts'

export type ProductSort = 'newest' | 'price-asc' | 'price-desc' | 'name'

const orderBy: Record<ProductSort, string> = {
  newest: 'created_at DESC, id DESC',
  'price-asc': 'price_cents ASC, id ASC',
  'price-desc': 'price_cents DESC, id ASC',
  name: 'name ASC, id ASC',
}

export async function listProducts({
  category,
  search,
  sort = 'newest',
}: { category?: Category; search?: string; sort?: ProductSort } = {}): Promise<Product[]> {
  // $1 and $2 are always bound; a null means "no filter" so the SQL stays one statement.
  const { rows } = await pool.query<Product>(
    `SELECT * FROM products
     WHERE ($1::text IS NULL OR category = $1)
       AND ($2::text IS NULL OR name ILIKE '%' || $2 || '%' OR description ILIKE '%' || $2 || '%')
     ORDER BY ${orderBy[sort]}`,
    [category ?? null, search ?? null],
  )
  return rows
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { rows } = await pool.query<Product>('SELECT * FROM products WHERE slug = $1', [slug])
  return rows[0] ?? null
}

export async function listFeaturedProducts(limit = 5): Promise<Product[]> {
  const { rows } = await pool.query<Product>(
    'SELECT * FROM products WHERE is_featured ORDER BY created_at DESC, id DESC LIMIT $1',
    [limit],
  )
  return rows
}

export async function listRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { rows } = await pool.query<Product>(
    'SELECT * FROM products WHERE category = $1 AND id <> $2 ORDER BY random() LIMIT $3',
    [product.category, product.id, limit],
  )
  return rows
}
