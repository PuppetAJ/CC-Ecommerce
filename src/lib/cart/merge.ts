import 'server-only'
import { cartExists, isGuestCart, mergeGuestCart } from '@/lib/db/queries/cart'
import { clearCartCookie, readCartCookie } from './cookie'

// Called from session.create.after, and imports no session helper, which would cycle through lib/auth.
export async function adoptGuestCart(userId: string): Promise<void> {
  const guestCartId = await readCartCookie()
  if (!guestCartId) return

  if ((await cartExists(guestCartId)) && (await isGuestCart(guestCartId))) {
    await mergeGuestCart(guestCartId, userId)
  }
  await clearCartCookie()
}
