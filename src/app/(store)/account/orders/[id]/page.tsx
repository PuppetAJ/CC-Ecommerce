import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { requireUser } from '@/lib/auth/session'
import { getOrderForUser } from '@/lib/db/queries/orders'
import { OrderSummary } from '@/features/checkout/components/order-summary'

export const metadata = { title: 'Order' }

export const instant = false

export default async function Page({ params }: PageProps<'/account/orders/[id]'>) {
  const user = await requireUser()
  const id = Number((await params).id)
  // The query is scoped to the signed-in user, so another shopper's id is simply not found.
  const order = Number.isInteger(id) ? await getOrderForUser(id, user.id) : null
  if (!order) notFound()

  return (
    <Container className="flex max-w-2xl flex-col gap-8 py-16">
      <Link
        href="/account/orders"
        className="text-sm text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white"
      >
        Back to your orders
      </Link>
      <Heading>Order #{order.id}</Heading>
      <OrderSummary order={order} heading={false} />
    </Container>
  )
}
