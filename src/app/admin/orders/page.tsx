import Link from 'next/link'
import { Suspense } from 'react'
import { OrderStatus } from '@/components/elements/order-status'
import { Cell, IndexTable, IndexTableSkeleton, Row } from '@/features/admin/components/index-table'
import { Pagination } from '@/features/admin/components/pagination'
import { SearchFilters } from '@/features/admin/components/search-filters'
import { adminListSearch, pageHref } from '@/features/admin/schemas'
import { requireAdmin } from '@/lib/auth/session'
import { listAdminOrders } from '@/lib/db/queries/admin'
import { perPage } from '@/lib/db/queries/paging'
import { orderStatuses } from '@/lib/db/types'
import { formatDate, formatPrice } from '@/lib/format'
import { z } from 'zod'
import { AdminHeading } from '@/features/admin/components/admin-heading'

export const metadata = { title: 'Orders · Admin' }

export const instant = false

const search = adminListSearch.extend({
  status: z.enum(orderStatuses).optional().catch(undefined),
})

export default async function Page({ searchParams }: PageProps<'/admin/orders'>) {
  await requireAdmin()
  const filters = search.parse(await searchParams)

  return (
    <div className="flex flex-col gap-6">
      <AdminHeading>Orders</AdminHeading>
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
      <Suspense key={JSON.stringify(filters)} fallback={<IndexTableSkeleton />}>
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
          <Row key={order.id}>
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
            <Cell className="whitespace-nowrap text-olive-600 dark:text-olive-400">{formatDate(order.created_at)}</Cell>
            <Cell>
              <OrderStatus status={order.status} />
            </Cell>
            <Cell className="text-olive-600 tabular-nums dark:text-olive-400">
              {order.items.reduce((count, item) => count + item.quantity, 0)}
            </Cell>
            <Cell align="right" className="font-medium text-olive-950 tabular-nums dark:text-white">
              {formatPrice(order.total_cents)}
            </Cell>
          </Row>
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
