import type { EventName } from './db/queries/events'
import { z } from 'zod'

// Declared here rather than imported from the query module, which is server-only.
export const eventNames = [
  'view',
  'product_view',
  'add_to_cart',
  'checkout_started',
  'purchase',
] as const satisfies readonly EventName[]

// A session id is opaque to us; the length bound is what the table's own CHECK enforces.
export const trackedEvent = z.object({
  name: z.enum(eventNames),
  session: z.string().min(8).max(64),
  path: z.string().min(1).max(512),
  productId: z.coerce.number().int().positive().nullish(),
})
