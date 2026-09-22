import { receiveStripeEvent } from '@/lib/stripe-webhook'

// Stripe signs the exact bytes it sent, so the body is read raw; parsing first breaks the signature.
export async function POST(request: Request): Promise<Response> {
  return receiveStripeEvent(await request.text(), request.headers.get('stripe-signature'))
}
