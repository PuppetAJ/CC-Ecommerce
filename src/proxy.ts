import { getSessionCookie } from 'better-auth/cookies'
import { NextResponse, type NextRequest } from 'next/server'

// Cookie presence only, never the database; the pages and actions do the real check.
export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) return NextResponse.next()

  const login = new URL('/login', request.url)
  login.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(login)
}

export const config = {
  matcher: ['/account', '/account/:path*', '/admin', '/admin/:path*'],
}
