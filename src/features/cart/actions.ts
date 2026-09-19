'use server'

import { revalidatePath } from 'next/cache'
import { addCartItem, clearCart, removeCartItem, setCartItemQuantity } from '@/lib/db/queries/cart'
import { resolveCartId } from './cart'
import { cartLine, cartTarget } from './schemas'

// addedAt is a fresh number every time, so the client can tell one success from the next.
export type CartState = { error?: string; addedAt?: number } | undefined

// The layout holds the badge and the sheet, so the whole tree has to re-render.
function refresh() {
  revalidatePath('/', 'layout')
}

export async function addToCart(_previous: CartState, formData: FormData): Promise<CartState> {
  const parsed = cartLine.safeParse({
    productId: formData.get('productId'),
    quantity: formData.get('quantity') ?? 1,
  })
  if (!parsed.success) return { error: 'That product could not be added.' }

  await addCartItem(await resolveCartId(), parsed.data.productId, Math.max(1, parsed.data.quantity))
  refresh()
  return { addedAt: Date.now() }
}

export async function setQuantity(productId: number, quantity: number): Promise<CartState> {
  const parsed = cartLine.safeParse({ productId, quantity })
  if (!parsed.success) return { error: 'That quantity is not allowed.' }

  await setCartItemQuantity(await resolveCartId(), parsed.data.productId, parsed.data.quantity)
  refresh()
}

export async function removeFromCart(productId: number): Promise<CartState> {
  const parsed = cartTarget.safeParse({ productId })
  if (!parsed.success) return { error: 'That item could not be removed.' }

  await removeCartItem(await resolveCartId(), parsed.data.productId)
  refresh()
}

export async function emptyCart(): Promise<void> {
  await clearCart(await resolveCartId())
  refresh()
}
