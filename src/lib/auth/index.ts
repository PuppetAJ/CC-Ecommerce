import 'server-only'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { authOptions } from './options.ts'

// nextCookies must come last, or a Server Action cannot return the session cookie.
export const auth = betterAuth({ ...authOptions, plugins: [nextCookies()] })

export type Session = typeof auth.$Infer.Session
