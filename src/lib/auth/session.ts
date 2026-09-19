import 'server-only'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { auth } from './index.ts'
import { hasRole } from './options.ts'

/** Reads the session from the request. Callers are request-time, so never cached. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

/** The real gate: the proxy only saw a cookie, this returns the verified row. */
export async function requireUser(next?: string) {
  const session = await getSession()
  if (!session) redirect(next ? `/login?next=${encodeURIComponent(next)}` : '/login')
  return session.user
}

/** 404 rather than 403, so the admin area does not advertise itself to a shopper. */
export async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/login?next=/admin')
  if (!hasRole(session.user, 'admin')) notFound()
  return session.user
}
