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
  materials,
  colors,
  sort = 'newest',
}: {
  category?: Category
  search?: string
  materials?: string[]
  colors?: string[]
  sort?: ProductSort
} = {}): Promise<Product[]> {
  // Every parameter is always bound; a null means "no filter" so the SQL stays one
  // statement. `&&` is array overlap, so picking oak and ash returns either, not both.
  const { rows } = await pool.query<Product>(
    `SELECT * FROM products
     WHERE ($1::text IS NULL OR category = $1)
       AND ($2::text IS NULL OR name ILIKE '%' || $2 || '%' OR description ILIKE '%' || $2 || '%')
       AND ($3::text[] IS NULL OR material_tags && $3)
       AND ($4::text[] IS NULL OR color = ANY($4))
     ORDER BY ${orderBy[sort]}`,
    [category ?? null, search ?? null, materials?.length ? materials : null, colors?.length ? colors : null],
  )
  return rows
}

/** What to offer in the filters, and how many each would leave. Counted from the catalogue
 * rather than the vocabulary, so a facet nothing carries is never shown. */
export async function listFacets(): Promise<{ materials: [string, number][]; colors: [string, number][] }> {
  const [materials, colors] = await Promise.all([
    pool.query<{ value: string; count: number }>(
      'SELECT unnest(material_tags) AS value, count(*)::int AS count FROM products GROUP BY value ORDER BY count DESC, value',
    ),
    pool.query<{ value: string; count: number }>(
      'SELECT color AS value, count(*)::int AS count FROM products WHERE color IS NOT NULL GROUP BY color ORDER BY count DESC, value',
    ),
  ])
  return {
    materials: materials.rows.map((row) => [row.value, row.count]),
    colors: colors.rows.map((row) => [row.value, row.count]),
  }
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
