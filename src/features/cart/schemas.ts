import { z } from 'zod'

// No cart id here: it comes from the cookie or the session, so a crafted form cannot name another.
export const cartLine = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(0).max(99),
})

export const cartTarget = cartLine.pick({ productId: true })
