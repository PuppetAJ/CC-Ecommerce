import { getSessionCookie } from 'better-auth/cookies'
import { NextResponse, type NextRequest } from 'next/server'

// Layer one of three: cookie presence only, never the database. See docs/phases/04-auth.md.
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next()

  const login = new URL('/login', request.url)
  login.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ['/account', '/account/:path*', '/admin', '/admin/:path*'],
}
