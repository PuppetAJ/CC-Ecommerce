import Link from 'next/link'
import { Suspense } from 'react'
import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'
import { ButtonLink } from '@/components/elements/button'
import { Skeleton } from '@/components/ui/skeleton'
import { getCart } from '@/features/cart/cart'
import { CartLines } from '@/features/cart/components/cart-lines'

export const metadata = { title: 'Your cart' }

export default function Page() {
  return (
    <Container className="flex flex-col gap-8 py-16">
      <Heading>Your cart</Heading>
      <Suspense fallback={<CartSkeleton />}>
        <Cart />
      </Suspense>
    </Container>
  )
}

async function Cart() {
  const items = await getCart()

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6">
        <Text size="lg" className="max-w-xl">
          <p>Nothing in here yet. The shelves are through this way.</p>
        </Text>
        <ButtonLink href="/shop" size="lg">
          Browse the collection
        </ButtonLink>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-olive-950/10 dark:border-white/10">
        <CartLines items={items} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <ButtonLink href="/checkout" size="lg">
          Checkout
        </ButtonLink>
        <Link href="/shop" className="text-sm text-olive-600 underline underline-offset-4 dark:text-olive-400">
          Keep looking
        </Link>
      </div>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1].map((row) => (
        <Skeleton key={row} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  )
}
