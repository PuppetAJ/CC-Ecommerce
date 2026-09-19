import 'server-only'
import { pool } from '../pool.ts'

export type RateLimitResult = { allowed: boolean; retryAfter: number }

/**
 * Better Auth rate limits its HTTP routes, but a Server Action calls auth.api
 * directly and never passes through that router, so the sign-in action would be
 * unlimited without this. Same table, `action:` prefixed keys so the two cannot
 * collide. See docs/phases/04-auth.md.
 *
 * One statement, because read-then-write lets N concurrent attempts all pass the
 * same stale count. last_request is the window's start, in epoch milliseconds.
 */
export async function consume(key: string, { window, max }: { window: number; max: number }): Promise<RateLimitResult> {
  const now = Date.now()
  const windowStartedAfter = now - window * 1000

  const { rows } = await pool.query<{ count: number; last_request: string }>(
    `INSERT INTO rate_limits (id, key, count, last_request)
     VALUES (gen_random_uuid()::text, $1, 1, $2)
     ON CONFLICT (key) DO UPDATE SET
       count = CASE WHEN rate_limits.last_request < $3 THEN 1 ELSE rate_limits.count + 1 END,
       last_request = CASE WHEN rate_limits.last_request < $3 THEN $2 ELSE rate_limits.last_request END
     RETURNING count, last_request`,
    [key, now, windowStartedAfter],
  )

  const { count, last_request } = rows[0]!
  if (count <= max) return { allowed: true, retryAfter: 0 }
  return { allowed: false, retryAfter: Math.ceil((Number(last_request) + window * 1000 - now) / 1000) }
}
