import 'server-only'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { authOptions } from './options.ts'

// nextCookies must come last: it reads the Set-Cookie headers the other plugins
// produced and writes them through next/headers, which a Server Action needs to
// return a session cookie at all.
export const auth = betterAuth({ ...authOptions, plugins: [nextCookies()] })

export type Session = typeof auth.$Infer.Session
