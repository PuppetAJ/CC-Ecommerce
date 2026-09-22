import 'server-only'
import { z } from 'zod'

// Anything required must also be provided by CI, which builds and tests without a .env file.
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.url().default('http://localhost:3000'),
  DATABASE_URL: z.url(),
  // `openssl rand -base64 32`. Signs the session cookie, so changing it logs everyone out.
  BETTER_AUTH_SECRET: z.string().min(32),
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  // Test keys only; a live key here would take real money for pretend furniture.
  STRIPE_SECRET_KEY: z.string().startsWith('sk_test_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
})

// A blank key in .env arrives as '', which zod's .optional() does not treat as absent.
const blankIsAbsent = (value: string | undefined) => (value === '' ? undefined : value)

const parsed = schema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  // Tests run against their own database, so a test run cannot truncate dev data.
  DATABASE_URL: process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  GOOGLE_CLIENT_ID: blankIsAbsent(process.env.GOOGLE_CLIENT_ID),
  GOOGLE_CLIENT_SECRET: blankIsAbsent(process.env.GOOGLE_CLIENT_SECRET),
  STRIPE_SECRET_KEY: blankIsAbsent(process.env.STRIPE_SECRET_KEY),
  STRIPE_WEBHOOK_SECRET: blankIsAbsent(process.env.STRIPE_WEBHOOK_SECRET),
})

if (!parsed.success) {
  console.error('Invalid environment:', z.treeifyError(parsed.error))
  throw new Error('Invalid environment')
}

export const env = parsed.data

// The webhook secret gates the webhook route alone, so a deployment without it can still take a payment.
export const stripeEnabled = Boolean(env.STRIPE_SECRET_KEY)

/** Google sign-in is only offered when both halves of the credential are present. */
export const googleEnabled = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
