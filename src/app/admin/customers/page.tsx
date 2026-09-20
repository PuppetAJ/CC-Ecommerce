import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Cell, IndexTable } from '@/features/admin/components/index-table'
import { Pagination } from '@/features/admin/components/pagination'
import { SearchFilters } from '@/features/admin/components/search-filters'
import { pageHref, pageNumber } from '@/features/admin/schemas'
import { requireAdmin } from '@/lib/auth/session'
import { listCustomers, perPage } from '@/lib/db/queries/admin'
import { formatPrice } from '@/lib/format'
import { z } from 'zod'

export const metadata = { title: 'Customers · Admin' }

export const instant = false

const search = z.object({
  q: z.string().trim().min(1).max(100).optional().catch(undefined),
  page: pageNumber,
})

export default async function Page({ searchParams }: PageProps<'/admin/customers'>) {
  await requireAdmin()
  const filters = search.parse(await searchParams)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-medium text-olive-950 dark:text-white">Customers</h1>
        {/* Read-only on purpose: an account is somebody's, and a demo should not delete one. */}
        <p className="text-sm text-olive-600 dark:text-olive-400">
          Read-only. Accounts cannot be edited or removed from here.
        </p>
      </div>
      <SearchFilters action="/admin/customers" placeholder="Name or email" defaults={{ q: filters.q }} />
      <Suspense key={JSON.stringify(filters)} fallback={<Skeleton className="h-64 rounded-xl" />}>
        <Rows q={filters.q} page={filters.page} />
      </Suspense>
    </div>
  )
}

async function Rows({ q, page }: { q?: string; page: number }) {
  const { rows: customers, total } = await listCustomers(q, page)

  return (
    <>
      <IndexTable columns={['Customer', 'Joined', 'Orders', 'Last order', 'Spent']} empty="Nobody matches that.">
        {customers.map((customer) => (
          <tr key={customer.id} className="hover:bg-olive-950/[0.03] dark:hover:bg-white/[0.03]">
            <Cell>
              <span className="block text-xs text-olive-600 dark:text-olive-400">{customer.email}</span>
              <span className="font-medium text-olive-950 dark:text-white">{customer.name}</span>
            </Cell>
            <Cell className="whitespace-nowrap text-olive-600 dark:text-olive-400">
              {customer.created_at.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Cell>
            <Cell className="text-olive-600 tabular-nums dark:text-olive-400">{customer.orders}</Cell>
            <Cell className="whitespace-nowrap text-olive-600 dark:text-olive-400">
              {customer.last_order
                ? customer.last_order.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'Never'}
            </Cell>
            <Cell align="right" className="font-medium text-olive-950 tabular-nums dark:text-white">
              {formatPrice(customer.spent_cents)}
            </Cell>
          </tr>
        ))}
      </IndexTable>
      <Pagination
        page={page}
        total={total}
        perPage={perPage}
        href={(next) => pageHref('/admin/customers', { q }, next)}
      />
    </>
  )
}
