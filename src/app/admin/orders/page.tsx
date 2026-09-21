import Link from 'next/link'
import { Suspense } from 'react'
import { OrderStatus } from '@/components/elements/order-status'
import { Skeleton } from '@/components/ui/skeleton'
import { Cell, IndexTable } from '@/features/admin/components/index-table'
import { Pagination } from '@/features/admin/components/pagination'
import { SearchFilters } from '@/features/admin/components/search-filters'
import { pageHref, pageNumber } from '@/features/admin/schemas'
import { requireAdmin } from '@/lib/auth/session'
import { listAdminOrders, perPage } from '@/lib/db/queries/admin'
import { orderStatuses } from '@/lib/db/types'
import { formatPrice } from '@/lib/format'
import { z } from 'zod'

export const metadata = { title: 'Orders · Admin' }

export const instant = false

const search = z.object({
  q: z.string().trim().min(1).max(100).optional().catch(undefined),
  status: z.enum(orderStatuses).optional().catch(undefined),
  page: pageNumber,
})

export default async function Page({ searchParams }: PageProps<'/admin/orders'>) {
  await requireAdmin()
  const filters = search.parse(await searchParams)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-medium text-olive-950 dark:text-white">Orders</h1>
      <SearchFilters
        action="/admin/orders"
        placeholder="Customer name or email"
        defaults={{ q: filters.q }}
        selects={[
          {
            name: 'status',
            label: 'Any status',
            value: filters.status,
            options: orderStatuses.map((status) => ({ value: status, label: status })),
          },
        ]}
      />
      <Suspense key={JSON.stringify(filters)} fallback={<Skeleton className="h-64 rounded-xl" />}>
        <Rows filters={filters} />
      </Suspense>
    </div>
  )
}

async function Rows({ filters }: { filters: z.infer<typeof search> }) {
  const { rows: orders, total } = await listAdminOrders(filters)

  return (
    <>
      <IndexTable columns={['Order', 'Placed', 'Status', 'Items', 'Total']} empty="No orders match that.">
        {orders.map((order) => (
          <tr key={order.id} className="hover:bg-olive-950/[0.03] dark:hover:bg-white/[0.03]">
            <Cell>
              {/* Primary, with the customer as the kicker above it. */}
              <span className="block text-xs text-olive-600 dark:text-olive-400">{order.customer_name}</span>
              <Link
                href={`/admin/orders/${order.id}`}
                className="font-medium text-olive-950 hover:underline dark:text-white"
              >
                Order #{order.id}
              </Link>
            </Cell>
            <Cell className="whitespace-nowrap text-olive-600 dark:text-olive-400">
              {order.created_at.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Cell>
            <Cell>
              <OrderStatus status={order.status} />
            </Cell>
            <Cell className="text-olive-600 tabular-nums dark:text-olive-400">
              {order.items.reduce((count, item) => count + item.quantity, 0)}
            </Cell>
            <Cell align="right" className="font-medium text-olive-950 tabular-nums dark:text-white">
              {formatPrice(order.total_cents)}
            </Cell>
          </tr>
        ))}
      </IndexTable>
      <Pagination
        page={filters.page}
        total={total}
        perPage={perPage}
        href={(page) => pageHref('/admin/orders', { q: filters.q, status: filters.status }, page)}
      />
    </>
  )
}
