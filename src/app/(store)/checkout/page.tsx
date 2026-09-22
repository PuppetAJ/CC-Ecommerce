import Link from 'next/link'
import Image from 'next/image'
import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'
import { ButtonLink } from '@/components/elements/button'
import { requireUser } from '@/lib/auth/session'
import { cartSubtotal, getCart } from '@/features/cart/cart'
import { OrderBreakdown } from '@/features/checkout/components/order-breakdown'
import { PayButton } from '@/features/checkout/components/pay-button'
import { formatPrice } from '@/lib/format'
import { stripeEnabled } from '@/lib/env'

export const metadata = { title: 'Checkout' }

export const instant = false

export default async function Page() {
  const user = await requireUser()
  const items = await getCart()

  if (items.length === 0) {
    return (
      <Container className="flex flex-col items-start gap-6 py-16">
        <Heading>Nothing to pay for</Heading>
        <Text size="lg" className="max-w-xl">
          <p>Your cart is empty, so there is nothing to check out.</p>
        </Text>
        <ButtonLink href="/shop" size="lg">
          Browse the collection
        </ButtonLink>
      </Container>
    )
  }

  const total = cartSubtotal(items)

  return (
    <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_24rem]">
      <div className="flex flex-col gap-8">
        <Heading>Checkout</Heading>
        <ul className="divide-y divide-olive-950/10 dark:divide-white/10">
          {items.map((item) => (
            <li key={item.product_id} className="flex gap-4 py-4">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-tile">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill sizes="80px" className="object-cover" />
                ) : null}
              </div>
              <div className="flex flex-1 items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-olive-950 dark:text-white">{item.name}</p>
                  <p className="text-sm text-olive-600 dark:text-olive-400">Quantity {item.quantity}</p>
                </div>
                <p className="text-sm text-olive-950 tabular-nums dark:text-white">
                  {formatPrice(item.unit_price_cents * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/cart" className="text-sm text-olive-600 underline underline-offset-4 dark:text-olive-400">
          Change something
        </Link>

        <ol className="flex flex-col gap-4 border-t border-olive-950/10 pt-8 dark:border-white/10">
          {[
            ['Pay with Stripe', "You'll be handed to Stripe to enter a card. We never see it."],
            ['We pack it', 'Molded paper and cardboard, no plastic, usually the next business day.'],
            ['It arrives', 'Three to five business days. Anything unused can come back within thirty.'],
          ].map(([title, detail], step) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-olive-950/5 text-xs font-medium text-olive-950 dark:bg-white/10 dark:text-white">
                {step + 1}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-olive-950 dark:text-white">{title}</span>
                <span className="text-sm text-olive-600 dark:text-olive-400">{detail}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <aside className="flex h-fit flex-col gap-5 rounded-xl border border-olive-950/10 p-6 lg:sticky lg:top-24 dark:border-white/10">
        <div className="flex justify-between text-sm text-olive-600 dark:text-olive-400">
          <span>Signed in as</span>
          <span className="truncate text-olive-950 dark:text-white">{user.email}</span>
        </div>
        <OrderBreakdown subtotal={total} />

        {stripeEnabled ? (
          <>
            <PayButton total={formatPrice(total)} />
            <div className="rounded-lg bg-olive-950/5 p-4 text-xs/5 text-olive-700 dark:bg-white/5 dark:text-olive-400">
              <p className="font-medium text-olive-950 dark:text-white">
                This is a demo. Use Stripe&rsquo;s test card.
              </p>
              <p className="mt-1">
                <code className="rounded bg-olive-950/5 px-1 py-0.5 dark:bg-white/10">4242 4242 4242 4242</code>, any
                future expiry, any CVC, any ZIP code. No money moves.
              </p>
            </div>
          </>
        ) : (
          <p className="text-sm text-olive-600 dark:text-olive-400">Payments are not configured on this deployment.</p>
        )}
      </aside>
    </Container>
  )
}
