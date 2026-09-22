'use server'

import { addCartItem, removeCartItem, setCartItemQuantity } from '@/lib/db/queries/cart'
import { resolveCartId } from './cart'
import { cartLine, cartTarget } from './schemas'
import { succeeded, type ActionState } from '@/lib/action-state'

// No session check: a cart belongs to a cookie until somebody signs in, and guests may shop.

// No revalidatePath here. A form action re-renders its own route tree, and the imperative
// ones are refreshed by the client that called them, which keeps the catalog cache intact.

export type CartState = ActionState

export async function addToCart(_previous: CartState, formData: FormData): Promise<CartState> {
  const parsed = cartLine.safeParse({
    productId: formData.get('productId'),
    quantity: formData.get('quantity') ?? 1,
  })
  if (!parsed.success) return { error: 'That product could not be added.' }

  await addCartItem(await resolveCartId(), parsed.data.productId, Math.max(1, parsed.data.quantity))
  return succeeded()
}

export async function setQuantity(productId: number, quantity: number): Promise<CartState> {
  const parsed = cartLine.safeParse({ productId, quantity })
  if (!parsed.success) return { error: 'That quantity is not allowed.' }

  await setCartItemQuantity(await resolveCartId(), parsed.data.productId, parsed.data.quantity)
}

export async function removeFromCart(productId: number): Promise<CartState> {
  const parsed = cartTarget.safeParse({ productId })
  if (!parsed.success) return { error: 'That item could not be removed.' }

  await removeCartItem(await resolveCartId(), parsed.data.productId)
}

/** One of a thing, from the grid. The product page keeps the stepper. */
export async function quickAdd(productId: number): Promise<CartState> {
  const parsed = cartTarget.safeParse({ productId })
  if (!parsed.success) return { error: 'That product could not be added.' }

  await addCartItem(await resolveCartId(), parsed.data.productId, 1)
  return succeeded()
}
