import 'server-only'
import { Pool } from 'pg'
import { env } from '../env.ts'

// Next re-evaluates modules on every edit in dev, so a plain `new Pool()` would
// leak a pool per edit until Postgres refused new connections.
const globalForPool = globalThis as { wickenPool?: Pool }

// Postgres kills anything still running after ten seconds, so one pathological query cannot
// hold a connection open indefinitely. Every query here should finish in milliseconds.
export const pool =
  globalForPool.wickenPool ?? new Pool({ connectionString: env.DATABASE_URL, statement_timeout: 10_000 })

if (env.NODE_ENV !== 'production') globalForPool.wickenPool = pool

/** Runs `fn` inside a transaction on a single client, rolling back if it throws. */
export async function transaction<T>(fn: (client: import('pg').PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
