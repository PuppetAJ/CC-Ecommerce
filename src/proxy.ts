import { getSessionCookie } from 'better-auth/cookies'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Layer one of three. It checks that a session cookie exists and nothing more:
 * the proxy runs on every matched request and must not query the database or
 * verify a signature. A forged cookie gets past it, which is why the layouts and
 * every Server Action call getSession() and work from the row it returns.
 *
 * Its real job is the friendly one — sending a signed-out visitor to /login with
 * a ?next= so they land back where they were aiming.
 */
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next()

  const login = new URL('/login', request.url)
  login.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ['/account', '/account/:path*', '/admin', '/admin/:path*'],
}
