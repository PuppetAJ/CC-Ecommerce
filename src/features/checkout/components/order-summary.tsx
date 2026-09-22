import type { Order } from '@/lib/db/types'
import { formatDateLong, formatPrice } from '@/lib/format'
import { OrderStatus } from '@/components/elements/order-status'
import { linesOf, OrderLines } from '@/components/elements/order-lines'

export function OrderSummary({ order, heading = true }: { order: Order; heading?: boolean }) {
  return (
    <div className="flex flex-col gap-6 rounded-xl border border-olive-950/10 p-6 dark:border-white/10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        {heading ? (
          <h2 className="font-display text-xl font-medium text-olive-950 dark:text-white">Order #{order.id}</h2>
        ) : (
          <span className="text-sm text-olive-600 dark:text-olive-400">Placed {formatDateLong(order.created_at)}</span>
        )}
        <OrderStatus status={order.status} />
      </div>

      <OrderLines items={linesOf(order.items)} />

      <div className="flex justify-between border-t border-olive-950/10 pt-4 font-medium text-olive-950 dark:border-white/10 dark:text-white">
        <span>Total</span>
        <span className="tabular-nums">{formatPrice(order.total_cents)}</span>
      </div>
    </div>
  )
}
