import 'server-only'
import type { BetterAuthOptions } from 'better-auth'
import { pool } from '../db/pool.ts'
import { env, googleEnabled } from '../env.ts'

export const roles = ['customer', 'admin'] as const
export type Role = (typeof roles)[number]

// Better Auth infers an additional field as plain `string`, so comparing through
// here is what makes a mistyped role name a type error rather than a silent false.
export function hasRole(user: { role?: string | null }, role: Role): boolean {
  return user.role === role
}

// Kept apart from ./index.ts, which adds the Next plugin, so the seed script can
// build its own instance under plain Node.
export const authOptions = {
  appName: 'Wicken',
  baseURL: env.APP_URL,
  secret: env.BETTER_AUTH_SECRET,

  // The same pg pool the catalog queries use, so there is one connection budget.
  database: pool,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
  },

  socialProviders: googleEnabled
    ? { google: { clientId: env.GOOGLE_CLIENT_ID!, clientSecret: env.GOOGLE_CLIENT_SECRET! } }
    : {},

  session: {
    modelName: 'sessions',
    fields: {
      userId: 'user_id',
      expiresAt: 'expires_at',
      ipAddress: 'ip_address',
      userAgent: 'user_agent',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },

  user: {
    modelName: 'users',
    fields: { emailVerified: 'email_verified', createdAt: 'created_at', updatedAt: 'updated_at' },
    additionalFields: {
      // input: false, or the sign-up body could ask for role: 'admin'.
      role: { type: 'string', required: false, input: false, defaultValue: 'customer' },
    },
  },
  account: {
    modelName: 'accounts',
    fields: {
      userId: 'user_id',
      accountId: 'account_id',
      providerId: 'provider_id',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      idToken: 'id_token',
      accessTokenExpiresAt: 'access_token_expires_at',
      refreshTokenExpiresAt: 'refresh_token_expires_at',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
  verification: {
    modelName: 'verifications',
    fields: { expiresAt: 'expires_at', createdAt: 'created_at', updatedAt: 'updated_at' },
  },

  rateLimit: {
    // Better Auth only rate limits in production by default; on in every mode here
    // so the limit is something the tests can actually exercise.
    enabled: true,
    storage: 'database',
    modelName: 'rate_limits',
    fields: { lastRequest: 'last_request' },
    window: 60,
    max: 100,
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 5 },
      '/forget-password': { window: 60, max: 3 },
    },
  },
} satisfies BetterAuthOptions
