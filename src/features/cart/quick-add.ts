'use server'

import { addCartItem } from '@/lib/db/queries/cart'
import { resolveCartId } from './cart'
import { cartTarget } from './schemas'

export type QuickAddState = { addedAt?: number; error?: string }

/** One of a thing, from the grid. The product page keeps the stepper. */
export async function quickAdd(productId: number): Promise<QuickAddState> {
  const parsed = cartTarget.safeParse({ productId })
  if (!parsed.success) return { error: 'That product could not be added.' }

  await addCartItem(await resolveCartId(), parsed.data.productId, 1)
  return { addedAt: Date.now() }
}
