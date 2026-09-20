import 'server-only'
import { pool } from '../pool.ts'

export const eventNames = ['view', 'product_view', 'add_to_cart', 'checkout_started', 'purchase'] as const
export type EventName = (typeof eventNames)[number]

export async function recordEvent(event: {
  name: EventName
  session: string
  path: string
  productId?: number | null
}): Promise<void> {
  await pool.query('INSERT INTO events (name, session, path, product_id) VALUES ($1, $2, $3, $4)', [
    event.name,
    event.session,
    event.path.slice(0, 512),
    event.productId ?? null,
  ])
}

export type Funnel = {
  sessions: number
  product_views: number
  carts: number
  checkouts: number
  purchases: number
}

/**
 * Counts distinct sessions at each step, not raw events, because a shopper who opens six
 * product pages is still one person deciding.
 */
export async function funnelBetween(from: Date, to: Date): Promise<Funnel> {
  const { rows } = await pool.query<Record<keyof Funnel, string>>(
    `SELECT count(DISTINCT session) FILTER (WHERE name = 'view') AS sessions,
            count(DISTINCT session) FILTER (WHERE name = 'product_view') AS product_views,
            count(DISTINCT session) FILTER (WHERE name = 'add_to_cart') AS carts,
            count(DISTINCT session) FILTER (WHERE name = 'checkout_started') AS checkouts,
            count(DISTINCT session) FILTER (WHERE name = 'purchase') AS purchases
       FROM events WHERE created_at >= $1 AND created_at < $2`,
    [from, to],
  )
  const row = rows[0]
  return {
    sessions: Number(row.sessions),
    product_views: Number(row.product_views),
    carts: Number(row.carts),
    checkouts: Number(row.checkouts),
    purchases: Number(row.purchases),
  }
}

export type SessionPoint = { day: string; sessions: number }

export async function sessionsByDay(from: Date, to: Date): Promise<SessionPoint[]> {
  const { rows } = await pool.query<{ day: string; sessions: string }>(
    `SELECT to_char(days.day, 'YYYY-MM-DD') AS day, count(DISTINCT e.session) AS sessions
       FROM generate_series($1::date, $2::date - interval '1 day', interval '1 day') AS days(day)
       LEFT JOIN events e ON e.created_at >= days.day AND e.created_at < days.day + interval '1 day'
                         AND e.name = 'view'
      GROUP BY days.day ORDER BY days.day`,
    [from, to],
  )
  return rows.map((row) => ({ day: row.day, sessions: Number(row.sessions) }))
}

export type PopularPage = { path: string; views: number }

export async function popularPages(from: Date, to: Date, limit = 6): Promise<PopularPage[]> {
  const { rows } = await pool.query<{ path: string; views: string }>(
    `SELECT path, count(*) AS views FROM events
      WHERE name = 'view' AND created_at >= $1 AND created_at < $2
      GROUP BY path ORDER BY count(*) DESC LIMIT $3`,
    [from, to, limit],
  )
  return rows.map((row) => ({ path: row.path, views: Number(row.views) }))
}
