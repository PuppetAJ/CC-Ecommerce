import { withoutNulls } from '@/lib/db/text'
import { z } from 'zod'

export const signup = z.object({
  email: z
    .string()
    .transform(withoutNulls)
    .pipe(z.string().trim().max(160).pipe(z.email('That does not look like an email address'))),
  source: z.enum(['footer', 'landing']),
})
