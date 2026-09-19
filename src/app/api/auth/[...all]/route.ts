import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth'

// Better Auth owns every path under /api/auth: sign-in, sign-out, the Google
// callback, session lookups. Its own router handles the matching.
export const { GET, POST } = toNextJsHandler(auth)
