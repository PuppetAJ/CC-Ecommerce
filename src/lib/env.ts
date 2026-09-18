import 'server-only'
import { z } from 'zod'

// Each phase adds its own keys here. Anything required must have a default, or CI's
// `pnpm build` will fail: it runs without a .env file.
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_URL: z.url().default('http://localhost:3000'),
})

const parsed = schema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
})

if (!parsed.success) {
  console.error('Invalid environment:', z.treeifyError(parsed.error))
  throw new Error('Invalid environment')
}

export const env = parsed.data
