import 'server-only'
import { pool } from '../pool.ts'
import { withoutNulls } from '../text.ts'

type SubscriberSource = 'footer' | 'landing'

/** True when the address was new; false when it was already on the list. */
export async function subscribe(email: string, source: SubscriberSource): Promise<boolean> {
  // Lower-cased so a second signup with different capitals is the same person, not a second row.
  const { rowCount } = await pool.query(
    'INSERT INTO subscribers (email, source) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
    [withoutNulls(email).toLowerCase(), source],
  )
  return rowCount === 1
}

export async function countSubscribers(): Promise<number> {
  const { rows } = await pool.query<{ count: string }>('SELECT count(*) AS count FROM subscribers')
  return Number(rows[0].count)
}
