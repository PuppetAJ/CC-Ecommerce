import Link from 'next/link'
import { Suspense } from 'react'
import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'
import { ButtonLink } from '@/components/elements/button'
import { Skeleton } from '@/components/ui/skeleton'
import { requireUser } from '@/lib/auth/session'
import { listOrdersForUser } from '@/lib/db/queries/orders'
import { formatPrice } from '@/lib/format'

export const metadata = { title: 'Your orders' }

export const instant = false

export default function Page() {
  return (
    <Container className="flex flex-col gap-8 py-16">
      <Heading>Your orders</Heading>
      <Suspense fallback={<Skeleton className="h-40 w-full max-w-2xl rounded-xl" />}>
        <Orders />
      </Suspense>
    </Container>
  )
}

async function Orders() {
  const user = await requireUser()
  // One query with JSON aggregation, so a page of orders is one round trip, not one per order.
  const orders = await listOrdersForUser(user.id)

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6">
        <Text size="lg" className="max-w-xl">
          <p>Nothing ordered yet.</p>
        </Text>
        <ButtonLink href="/shop" size="lg">
          Browse the collection
        </ButtonLink>
      </div>
    )
  }

  return (
    <ul className="flex max-w-2xl flex-col gap-4">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/account/orders/${order.id}`}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-xl border border-olive-950/10 p-5 transition-colors hover:bg-olive-950/[0.03] dark:border-white/10 dark:hover:bg-white/5"
          >
            <span className="font-medium text-olive-950 dark:text-white">Order #{order.id}</span>
            <span className="text-sm text-olive-600 dark:text-olive-400">
              {order.created_at.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-sm text-olive-600 dark:text-olive-400">
              {order.items.reduce((count, item) => count + item.quantity, 0)} item
              {order.items.reduce((count, item) => count + item.quantity, 0) === 1 ? '' : 's'}
            </span>
            <span className="text-sm text-olive-950 tabular-nums dark:text-white">
              {formatPrice(order.total_cents)}
            </span>
            <span className="text-sm text-olive-600 dark:text-olive-400">
              {order.status === 'paid' ? 'Paid' : order.status === 'pending' ? 'Awaiting payment' : 'Cancelled'}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
