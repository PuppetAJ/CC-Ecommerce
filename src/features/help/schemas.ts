import { withoutNulls } from '@/lib/db/text'
import { z } from 'zod'

// The messages that arrive are read by a person, so the bounds are about what is sensible to
// read rather than what the column will hold.
export const message = z.object({
  name: z.string().transform(withoutNulls).pipe(z.string().trim().min(1, 'Tell us who you are').max(80)),
  email: z
    .string()
    .transform(withoutNulls)
    .pipe(z.string().trim().max(160).pipe(z.email('That does not look like an email address'))),
  body: z.string().transform(withoutNulls).pipe(z.string().trim().min(10, 'A sentence or two is plenty').max(2000)),
})
