import type { Order } from '@/lib/db/types'

const styles: Record<Order['status'], string> = {
  paid: 'bg-olive-950/10 text-olive-950 dark:bg-white/15 dark:text-white',
  pending: 'bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200',
  canceled: 'bg-olive-950/5 text-olive-600 dark:bg-white/5 dark:text-olive-400',
}

const labels: Record<Order['status'], string> = {
  paid: 'Paid',
  pending: 'Awaiting payment',
  canceled: 'Canceled',
}

export function OrderStatus({ status }: { status: Order['status'] }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
