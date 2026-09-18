import 'server-only'
import { z } from 'zod'

// Each phase adds its own keys. Anything required must also be provided by CI,
// which runs `pnpm build` and `pnpm test` without a .env file.
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.url().default('http://localhost:3000'),
  DATABASE_URL: z.url(),
})

const parsed = schema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  // Tests run against their own database, so a test run cannot truncate dev data.
  DATABASE_URL: process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL,
})

if (!parsed.success) {
  console.error('Invalid environment:', z.treeifyError(parsed.error))
  throw new Error('Invalid environment')
}

export const env = parsed.data
