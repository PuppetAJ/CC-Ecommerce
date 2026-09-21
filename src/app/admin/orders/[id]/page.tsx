import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { OrderStatus } from '@/components/elements/order-status'
import { OrderMover } from '@/features/admin/components/order-mover'
import { requireAdmin } from '@/lib/auth/session'
import { getAdminOrder } from '@/lib/db/queries/admin'
import { formatPrice } from '@/lib/format'

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
          <h1 className="font-display text-2xl font-medium text-olive-950 dark:text-white">Order #{order.id}</h1>
          <OrderStatus status={order.status} />
        </div>
      </div>

      <dl className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        {[
          ['Customer', order.customer_name],
          ['Email', order.customer_email],
          ['Placed', order.created_at.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })],
          [
            'Paid',
            order.paid_at
              ? order.paid_at.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
              : 'Not yet',
          ],
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

      <ul className="divide-y divide-olive-950/10 rounded-xl border border-olive-950/10 px-5 dark:divide-white/10 dark:border-white/10">
        {order.items.map((item) => (
          <li key={`${item.product_slug}-${item.product_name}`} className="flex gap-4 py-4">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-tile">
              {item.image_url ? <Image src={item.image_url} alt="" fill sizes="56px" className="object-cover" /> : null}
            </div>
            <div className="flex flex-1 items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-olive-950 dark:text-white">{item.product_name}</p>
                <p className="text-sm text-olive-600 dark:text-olive-400">Quantity {item.quantity}</p>
              </div>
              <p className="text-sm text-olive-950 tabular-nums dark:text-white">
                {formatPrice(item.unit_price_cents * item.quantity)}
              </p>
            </div>
          </li>
        ))}
        <li className="flex justify-between py-4 font-medium text-olive-950 dark:text-white">
          <span>Total</span>
          <span className="tabular-nums">{formatPrice(order.total_cents)}</span>
        </li>
      </ul>

      <OrderMover orderId={order.id} status={order.status} />
    </div>
  )
}
