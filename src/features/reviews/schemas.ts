import { z } from 'zod'

export const review = z.object({
  productId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().trim().min(1).max(2000),
})
