import assert from 'node:assert/strict'
import { after, beforeEach, describe, it } from 'node:test'
import { betterAuth } from 'better-auth'
import { pool } from '../db/pool.ts'
import { resetDatabase } from '../db/test-support.ts'
import { authOptions } from './options.ts'

// ./index.ts pulls next/headers, which will not resolve here, so the instance is built from the options.
const auth = betterAuth(authOptions)

after(() => pool.end())
beforeEach(resetDatabase)

const shopper = { name: 'Test Shopper', email: 'test@example.com', password: 'a-long-enough-password' }

describe('authentication', () => {
  it('stores a hashed password against a credential account', async () => {
    await auth.api.signUpEmail({ body: shopper })

    const { rows } = await pool.query<{ provider_id: string; password: string }>(
      'SELECT provider_id, password FROM accounts',
    )
    assert.equal(rows.length, 1)
    assert.equal(rows[0].provider_id, 'credential')
    assert.notEqual(rows[0].password, shopper.password, 'the plain password must never reach the table')
  })

  it('refuses a wrong password', async () => {
    await auth.api.signUpEmail({ body: shopper })

    await assert.rejects(() => auth.api.signInEmail({ body: { email: shopper.email, password: 'wrong-password-x' } }))
  })

  it('refuses a password under the minimum length', async () => {
    await assert.rejects(() => auth.api.signUpEmail({ body: { ...shopper, password: 'short' } }))
  })

  it('refuses a second account on the same email', async () => {
    await auth.api.signUpEmail({ body: shopper })
    await assert.rejects(() => auth.api.signUpEmail({ body: shopper }))
  })

  it('never lets the sign-up body choose its own role', async () => {
    // Without input: false on the field, a crafted sign-up POST would hand the caller the admin dashboard.
    await auth.api.signUpEmail({ body: { ...shopper, role: 'admin' } as never })

    const { rows } = await pool.query<{ role: string }>('SELECT role FROM users')
    assert.equal(rows[0].role, 'customer')
  })

  it('issues a cookie that resolves back to the user', async () => {
    await auth.api.signUpEmail({ body: shopper })

    // asResponse, because the cookie is the thing the browser and the proxy see.
    const response = await auth.api.signInEmail({
      body: { email: shopper.email, password: shopper.password },
      asResponse: true,
    })
    const cookie = response.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ')

    const session = await auth.api.getSession({ headers: new Headers({ cookie }) })
    assert.equal(session?.user.email, shopper.email)
    assert.equal(session?.user.role, 'customer')
  })
})
