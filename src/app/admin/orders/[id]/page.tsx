import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OrderStatus } from '@/components/elements/order-status'
import { OrderMover } from '@/features/admin/components/order-mover'
import { requireAdmin } from '@/lib/auth/session'
import { getAdminOrder } from '@/lib/db/queries/admin'
import { formatDateLong } from '@/lib/format'
import { linesOf, OrderLines } from '@/components/elements/order-lines'
import { AdminHeading } from '@/features/admin/components/admin-heading'

export const metadata = { title: 'Order · Admin' }

export const instant = false

export default async function Page({ params }: PageProps<'/admin/orders/[id]'>) {
  await requireAdmin()
  const id = Number((await params).id)
  const order = Number.isInteger(id) ? await getAdminOrder(id) : null
  if (!order) notFound()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/orders"
          className="text-sm text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white"
        >
          Back to orders
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <AdminHeading>Order #{order.id}</AdminHeading>
          <OrderStatus status={order.status} />
        </div>
      </div>

      <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        {[
          ['Customer', order.customer_name],
          ['Email', order.customer_email],
          ['Placed', formatDateLong(order.created_at)],
          ['Paid', order.paid_at ? formatDateLong(order.paid_at) : 'Pending'],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between gap-4 border-b border-olive-950/10 py-2 dark:border-white/10"
          >
            <dt className="text-olive-600 dark:text-olive-400">{label}</dt>
            <dd className="truncate text-olive-950 dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="rounded-xl border border-olive-950/10 px-5 dark:border-white/10">
        <OrderLines items={linesOf(order.items)} size="sm" total={order.total_cents} />
      </div>

      <OrderMover orderId={order.id} status={order.status} />
    </div>
  )
}
