import Image from 'next/image'
import Link from 'next/link'
import type { Order } from '@/lib/db/types'
import { formatPrice } from '@/lib/format'

const statusLabels: Record<Order['status'], string> = {
  pending: 'Awaiting payment',
  paid: 'Paid',
  cancelled: 'Cancelled',
}

export function OrderSummary({ order, heading = true }: { order: Order; heading?: boolean }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-olive-950/10 p-6 dark:border-white/10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        {heading ? (
          <h2 className="font-display text-xl font-medium text-olive-950 dark:text-white">Order #{order.id}</h2>
        ) : (
          <span className="text-sm text-olive-600 dark:text-olive-400">
            Placed {order.created_at.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        )}
        <span className="text-sm text-olive-600 dark:text-olive-400">{statusLabels[order.status]}</span>
      </div>

      <ul className="divide-y divide-olive-950/10 dark:divide-white/10">
        {order.items.map((item) => (
          <li key={`${item.product_slug}-${item.product_name}`} className="flex gap-4 py-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-tile">
              {item.image_url ? (
                <Image src={item.image_url} alt={item.product_name} fill sizes="64px" className="object-cover" />
              ) : null}
            </div>
            <div className="flex flex-1 items-start justify-between gap-4">
              <div>
                {/* product_id goes null if the product is deleted; the name and price are copies. */}
                {item.product_id ? (
                  <Link
                    href={`/products/${item.product_slug}`}
                    className="text-sm font-medium text-olive-950 hover:underline dark:text-white"
                  >
                    {item.product_name}
                  </Link>
                ) : (
                  <span className="text-sm font-medium text-olive-950 dark:text-white">{item.product_name}</span>
                )}
                <p className="text-sm text-olive-600 dark:text-olive-400">Quantity {item.quantity}</p>
              </div>
              <p className="text-sm text-olive-950 tabular-nums dark:text-white">
                {formatPrice(item.unit_price_cents * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-between border-t border-olive-950/10 pt-4 font-medium text-olive-950 dark:border-white/10 dark:text-white">
        <span>Total</span>
        <span className="tabular-nums">{formatPrice(order.total_cents)}</span>
      </div>
    </div>
  )
}
