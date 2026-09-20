'use server'

import { redirect } from 'next/navigation'
import { attachStripeSession, createPendingOrder } from '@/lib/db/queries/orders'
import { getCartIdForUser } from '@/lib/db/queries/cart'
import { requireUser } from '@/lib/auth/session'
import { env } from '@/lib/env'
import { stripe } from '@/lib/stripe'

export type CheckoutState = { error: string } | undefined

export async function startCheckout(): Promise<CheckoutState> {
  const user = await requireUser()
  if (!stripe) return { error: 'Payments are not configured on this deployment.' }

  const cartId = await getCartIdForUser(user.id)
  if (!cartId) return { error: 'Your cart is empty.' }

  let url: string | null = null
  try {
    // The order is built from the cart rows and priced from the products table inside one
    // transaction. Nothing about the amount comes from the browser, which is A#1.
    const order = await createPendingOrder(user.id, cartId)

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: user.email,
      // Stripe is told what to charge; it is never asked.
      line_items: order.items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: item.unit_price_cents,
          product_data: {
            name: item.product_name,
            images: item.image_url ? [new URL(item.image_url, env.APP_URL).toString()] : undefined,
          },
        },
      })),
      success_url: `${env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.APP_URL}/cart`,
      // The webhook trusts this over anything the browser says it paid for.
      metadata: { orderId: String(order.id) },
    })

    await attachStripeSession(order.id, session.id)
    url = session.url
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'Cart is empty') return { error: 'Your cart is empty.' }
    if (message.startsWith('Not enough stock')) return { error: `${message}. Adjust the quantity and try again.` }
    console.error('checkout failed', error)
    return { error: 'Checkout could not be started. Nothing has been charged.' }
  }

  if (!url) return { error: 'Stripe did not return a payment page.' }
  redirect(url)
}
