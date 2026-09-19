import { betterAuth } from 'better-auth'
import { authOptions } from '../src/lib/auth/options.ts'
import { demoAccounts } from '../src/lib/auth/demo.ts'
import { pool } from '../src/lib/db/pool.ts'

// No nextCookies plugin: this runs under plain Node, where next/headers does not
// resolve. That is the whole reason the options live in their own module.
const auth = betterAuth(authOptions)

/**
 * Registered visitors are left alone, so a reseed does not log real people out.
 * Only the two demo rows are replaced, which also re-hashes their passwords if the
 * hashing options ever change.
 */
export async function seedDemoUsers(): Promise<void> {
  const accounts = Object.values(demoAccounts)
  await pool.query('DELETE FROM users WHERE email = ANY($1)', [accounts.map((a) => a.email)])

  for (const account of accounts) {
    await auth.api.signUpEmail({ body: account })
  }

  // signUpEmail signs the new user in, and nobody is holding those cookies.
  await pool.query('DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE email = ANY($1))', [
    accounts.map((a) => a.email),
  ])
  await pool.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', demoAccounts.admin.email])
}
