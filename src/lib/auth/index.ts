import 'server-only'
import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { adoptGuestCart } from '@/lib/cart/merge'
import { authOptions } from './options.ts'

// nextCookies must come last, or a Server Action cannot return the session cookie.
export const auth = betterAuth({
  ...authOptions,
  plugins: [nextCookies()],
  databaseHooks: {
    // Every sign-in makes a session, so this covers email, registration and Google alike.
    session: { create: { after: async (session) => adoptGuestCart(session.userId) } },
  },
})
