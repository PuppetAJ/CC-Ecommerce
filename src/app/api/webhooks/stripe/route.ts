import { markOrderPaid } from '@/lib/db/queries/orders'
import { env } from '@/lib/env'
import { stripe } from '@/lib/stripe'

// Stripe signs the exact bytes it sent, so the body is read raw. Parsing it first, or
// letting a framework parse it, breaks the signature.
export async function POST(request: Request): Promise<Response> {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) return new Response('Stripe is not configured', { status: 503 })

  const signature = request.headers.get('stripe-signature')
  if (!signature) return new Response('Missing signature', { status: 400 })

  let event
  try {
    event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    )
  } catch {
    // Anything unsigned or replayed outside the tolerance window stops here.
    return new Response('Invalid signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.payment_status === 'paid') {
      // markOrderPaid pays, decrements stock and clears the cart in one transaction, and
      // its UPDATE matches only a pending order, so a redelivery changes nothing.
      const applied = await markOrderPaid(session.id)
      console.log(`stripe ${event.id}: ${applied ? 'order marked paid' : 'already handled, ignored'}`)
    }
  }

  // 200 on anything signed, so Stripe stops retrying events this app does not act on.
  return Response.json({ received: true })
}
