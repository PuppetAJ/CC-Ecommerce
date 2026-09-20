import { z } from 'zod'

// The cart id is never among these: it comes from the cookie or the session, so a
// crafted form cannot name somebody else's cart.
export const cartLine = z.object({
  productId: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().min(0).max(99),
})

export const cartTarget = cartLine.pick({ productId: true })
