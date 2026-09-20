import 'server-only'
import { pool } from '../pool.ts'
import type { Category, Order, OrderStatus, Product } from '../types.ts'

export type Totals = { revenue_cents: number; orders: number; average_cents: number; returning_rate: number }

export type DashboardPoint = { day: string; revenue_cents: number; orders: number }

export type TopSeller = { id: number; name: string; slug: string; image_url: string | null; sold: number; revenue_cents: number }

/** Paid orders only: an order nobody paid for is not revenue, whatever the dashboard would rather say. */
// Every column is qualified: products carries a created_at too, and an unqualified one is ambiguous.
const paidWithin = (o: string) => `${o}.status = 'paid' AND ${o}.created_at >= $1 AND ${o}.created_at < $2`

export async function totalsBetween(from: Date, to: Date): Promise<Totals> {
  const { rows } = await pool.query<{ revenue: string | null; orders: string; buyers: string; repeat: string }>(
    `WITH paid AS (SELECT orders.user_id, orders.total_cents FROM orders WHERE ${paidWithin('orders')}),
          per_buyer AS (SELECT user_id, count(*) AS orders FROM paid GROUP BY user_id)
     SELECT (SELECT sum(total_cents) FROM paid) AS revenue,
            (SELECT count(*) FROM paid) AS orders,
            (SELECT count(*) FROM per_buyer) AS buyers,
            (SELECT count(*) FROM per_buyer WHERE orders > 1) AS repeat`,
    [from, to],
  )
  const revenue = Number(rows[0].revenue ?? 0)
  const orders = Number(rows[0].orders)
  const buyers = Number(rows[0].buyers)
  return {
    revenue_cents: revenue,
    orders,
    average_cents: orders > 0 ? Math.round(revenue / orders) : 0,
    returning_rate: buyers > 0 ? Number(rows[0].repeat) / buyers : 0,
  }
}

/** One row per day including the quiet ones, so the line does not skip a gap and imply trade. */
export async function revenueByDay(from: Date, to: Date): Promise<DashboardPoint[]> {
  const { rows } = await pool.query<{ day: string; revenue: string; orders: string }>(
    `SELECT to_char(days.day, 'YYYY-MM-DD') AS day,
            COALESCE(sum(o.total_cents), 0) AS revenue,
            count(o.id) AS orders
       FROM generate_series($1::date, $2::date - interval '1 day', interval '1 day') AS days(day)
       LEFT JOIN orders o ON o.created_at >= days.day AND o.created_at < days.day + interval '1 day'
                         AND o.status = 'paid'
      GROUP BY days.day ORDER BY days.day`,
    [from, to],
  )
  return rows.map((row) => ({ day: row.day, revenue_cents: Number(row.revenue), orders: Number(row.orders) }))
}

export async function topSellers(from: Date, to: Date, limit = 5): Promise<TopSeller[]> {
  const { rows } = await pool.query<TopSeller & { sold: string; revenue_cents: string }>(
    `SELECT p.id, p.name, p.slug, p.image_url,
            sum(oi.quantity) AS sold,
            sum(oi.quantity * oi.unit_price_cents) AS revenue_cents
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN products p ON p.id = oi.product_id
      WHERE ${paidWithin('o')}
      GROUP BY p.id, p.name, p.slug, p.image_url
      ORDER BY sum(oi.quantity * oi.unit_price_cents) DESC
      LIMIT $3`,
    [from, to, limit],
  )
  return rows.map((row) => ({ ...row, sold: Number(row.sold), revenue_cents: Number(row.revenue_cents) }))
}

export type CategorySplit = { category: Category; units: number; revenue_cents: number }

/** What the shop actually sells, by the category a product sits in. Paid orders only. */
export async function salesByCategory(from: Date, to: Date): Promise<CategorySplit[]> {
  const { rows } = await pool.query<{ category: Category; units: string; revenue_cents: string }>(
    `SELECT p.category, sum(oi.quantity) AS units, sum(oi.quantity * oi.unit_price_cents) AS revenue_cents
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       JOIN products p ON p.id = oi.product_id
      WHERE ${paidWithin('o')}
      GROUP BY p.category
      ORDER BY sum(oi.quantity * oi.unit_price_cents) DESC`,
    [from, to],
  )
  return rows.map((row) => ({ ...row, units: Number(row.units), revenue_cents: Number(row.revenue_cents) }))
}

export async function lowStock(threshold = 3, limit = 6): Promise<Product[]> {
  const { rows } = await pool.query<Product>(
    'SELECT * FROM products WHERE stock_quantity <= $1 ORDER BY stock_quantity, name LIMIT $2',
    [threshold, limit],
  )
  return rows
}

/** How many rows a list page shows. One number, so every list behaves the same way. */
export const perPage = 20

export type Page<T> = { rows: T[]; total: number }

// count(*) OVER () rides along with the rows, so a page and its total are one round trip.
const withTotal = 'count(*) OVER () AS total_rows'

function paged<T>(rows: (T & { total_rows?: string })[]): Page<T> {
  const total = rows.length > 0 ? Number(rows[0].total_rows) : 0
  return { rows: rows.map(({ total_rows: _ignored, ...rest }) => rest as unknown as T), total }
}

export type ProductFilters = { q?: string; category?: Category; stock?: 'low' | 'out'; page?: number }

export async function listAdminProducts({ q, category, stock, page = 1 }: ProductFilters = {}): Promise<Page<Product>> {
  const { rows } = await pool.query<Product & { total_rows: string }>(
    `SELECT *, ${withTotal} FROM products
      WHERE ($1::text IS NULL OR name ILIKE '%' || $1 || '%' OR slug ILIKE '%' || $1 || '%')
        AND ($2::text IS NULL OR category = $2)
        AND ($3::text IS NULL
             OR ($3 = 'low' AND stock_quantity BETWEEN 1 AND 3)
             OR ($3 = 'out' AND stock_quantity = 0))
      ORDER BY name
      LIMIT $4 OFFSET $5`,
    [q ?? null, category ?? null, stock ?? null, perPage, (page - 1) * perPage],
  )
  return paged<Product>(rows)
}

export async function getAdminProduct(id: number): Promise<Product | null> {
  const { rows } = await pool.query<Product>('SELECT * FROM products WHERE id = $1', [id])
  return rows[0] ?? null
}

export type ProductEdit = {
  price_cents: number
  sale_price_cents: number | null
  stock_quantity: number
  is_featured: boolean
}

/** Returns the saved row, so a caller never has to guess what the database settled on. */
export async function updateProduct(id: number, edit: ProductEdit): Promise<Product | null> {
  const { rows } = await pool.query<Product>(
    `UPDATE products
        SET price_cents = $2, sale_price_cents = $3, stock_quantity = $4, is_featured = $5
      WHERE id = $1
      RETURNING *`,
    [id, edit.price_cents, edit.sale_price_cents, edit.stock_quantity, edit.is_featured],
  )
  return rows[0] ?? null
}

const orderWithItems = `
  SELECT o.*, u.name AS customer_name, u.email AS customer_email, COALESCE(
    json_agg(
      json_build_object(
        'product_id', oi.product_id, 'product_name', oi.product_name, 'product_slug', oi.product_slug,
        'image_url', oi.image_url, 'quantity', oi.quantity, 'unit_price_cents', oi.unit_price_cents
      ) ORDER BY oi.id
    ) FILTER (WHERE oi.id IS NOT NULL), '[]'
  ) AS items
  FROM orders o
  JOIN users u ON u.id = o.user_id
  LEFT JOIN order_items oi ON oi.order_id = o.id
`

export type AdminOrder = Order & { customer_name: string; customer_email: string }

export async function listAdminOrders({
  status,
  q,
  page = 1,
}: { status?: OrderStatus; q?: string; page?: number } = {}): Promise<Page<AdminOrder>> {
  const { rows } = await pool.query<AdminOrder & { total_rows: string }>(
    `${orderWithItems}
      WHERE ($1::text IS NULL OR o.status = $1)
        AND ($2::text IS NULL OR u.name ILIKE '%' || $2 || '%' OR u.email ILIKE '%' || $2 || '%')
      GROUP BY o.id, u.name, u.email
      ORDER BY o.created_at DESC, o.id DESC
      LIMIT $3 OFFSET $4`,
    [status ?? null, q ?? null, perPage, (page - 1) * perPage],
  )
  return paged<AdminOrder>(rows)
}

export async function getAdminOrder(id: number): Promise<AdminOrder | null> {
  const { rows } = await pool.query<AdminOrder>(`${orderWithItems} WHERE o.id = $1 GROUP BY o.id, u.name, u.email`, [id])
  return rows[0] ?? null
}

/** paid_at follows the status, so the two can never disagree about whether money arrived. */
export async function setOrderStatus(id: number, status: OrderStatus): Promise<AdminOrder | null> {
  await pool.query(
    `UPDATE orders SET status = $2, paid_at = CASE WHEN $2 = 'paid' THEN COALESCE(paid_at, now()) ELSE NULL END
      WHERE id = $1`,
    [id, status],
  )
  return getAdminOrder(id)
}

export type Customer = {
  id: string
  name: string
  email: string
  created_at: Date
  orders: number
  spent_cents: number
  last_order: Date | null
}

export async function listCustomers(q?: string, page = 1): Promise<Page<Customer>> {
  const { rows } = await pool.query<Customer & { orders: string; spent_cents: string; total_rows: string }>(
    `SELECT u.id, u.name, u.email, u.created_at, ${withTotal},
            count(o.id) FILTER (WHERE o.status = 'paid') AS orders,
            COALESCE(sum(o.total_cents) FILTER (WHERE o.status = 'paid'), 0) AS spent_cents,
            max(o.created_at) AS last_order
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
      WHERE ($1::text IS NULL OR u.name ILIKE '%' || $1 || '%' OR u.email ILIKE '%' || $1 || '%')
      GROUP BY u.id, u.name, u.email, u.created_at
      ORDER BY COALESCE(sum(o.total_cents) FILTER (WHERE o.status = 'paid'), 0) DESC, u.name
      LIMIT $2 OFFSET $3`,
    [q ?? null, perPage, (page - 1) * perPage],
  )
  return paged<Customer>(
    rows.map((row) => ({ ...row, orders: Number(row.orders), spent_cents: Number(row.spent_cents) })),
  )
}

export type AdminReview = {
  user_id: string
  author: string
  product_id: number
  product_name: string
  product_slug: string
  rating: number
  body: string
  created_at: Date
}

export async function listAllReviews(q?: string, page = 1): Promise<Page<AdminReview>> {
  const { rows } = await pool.query<AdminReview & { total_rows: string }>(
    `SELECT r.user_id, u.name AS author, r.product_id, p.name AS product_name, p.slug AS product_slug,
            r.rating, r.body, r.created_at, ${withTotal}
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       JOIN products p ON p.id = r.product_id
      WHERE ($1::text IS NULL OR r.body ILIKE '%' || $1 || '%' OR u.name ILIKE '%' || $1 || '%'
             OR p.name ILIKE '%' || $1 || '%')
      ORDER BY r.created_at DESC, r.user_id
      LIMIT $2 OFFSET $3`,
    [q ?? null, perPage, (page - 1) * perPage],
  )
  return paged<AdminReview>(rows)
}

export async function deleteReview(userId: string, productId: number): Promise<void> {
  await pool.query('DELETE FROM reviews WHERE user_id = $1 AND product_id = $2', [userId, productId])
}
