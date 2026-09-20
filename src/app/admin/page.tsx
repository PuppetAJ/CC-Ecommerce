import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { SortSelect } from '@/components/elements/sort-select'
import { Skeleton } from '@/components/ui/skeleton'
import { Funnel } from '@/features/admin/components/funnel'
import { MetricCard } from '@/features/admin/components/metric-card'
import { TrendChart } from '@/features/admin/components/trend-chart'
import { adminHref, adminSearchSchema, rangeLabels, ranges, windows } from '@/features/admin/schemas'
import { requireAdmin } from '@/lib/auth/session'
import { lowStock, revenueByDay, topSellers, totalsBetween } from '@/lib/db/queries/admin'
import { funnelBetween, sessionsByDay } from '@/lib/db/queries/events'
import { formatPrice } from '@/lib/format'

export const metadata = { title: 'Admin' }

// Silences instant-navigation validation for the session read; it does not change the status
// code, which with Cache Components is settled before the check runs.
export const instant = false

export default async function Page({ searchParams }: PageProps<'/admin'>) {
  await requireAdmin()
  const { range } = adminSearchSchema.parse(await searchParams)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-medium text-olive-950 dark:text-white">Overview</h1>
        <SortSelect
          label="Period"
          value={range}
          options={ranges.map((value) => ({
            value,
            label: rangeLabels[value],
            href: adminHref('/admin', { range: value === '30' ? undefined : value }),
          }))}
        />
      </div>

      <Suspense key={range} fallback={<OverviewSkeleton />}>
        <Figures range={range} />
      </Suspense>
    </div>
  )
}

async function Figures({ range }: { range: '7' | '30' | '90' }) {
  const { from, to, wasFrom, wasTo } = windows(range)
  const [now, before, revenue, sessions, funnel, wasFunnel, sellers, low] = await Promise.all([
    totalsBetween(from, to),
    totalsBetween(wasFrom, wasTo),
    revenueByDay(from, to),
    sessionsByDay(from, to),
    funnelBetween(from, to),
    funnelBetween(wasFrom, wasTo),
    topSellers(from, to),
    lowStock(),
  ])

  const conversion = funnel.sessions > 0 ? (funnel.purchases / funnel.sessions) * 100 : 0
  const wasConversion = wasFunnel.sessions > 0 ? (wasFunnel.purchases / wasFunnel.sessions) * 100 : 0

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Gross sales"
          value={formatPrice(now.revenue_cents)}
          was={before.revenue_cents}
          now={now.revenue_cents}
        />
        <MetricCard label="Orders" value={String(now.orders)} was={before.orders} now={now.orders} />
        <MetricCard
          label="Average order"
          value={formatPrice(now.average_cents)}
          was={before.average_cents}
          now={now.average_cents}
        />
        <MetricCard
          label="Conversion"
          value={`${conversion.toFixed(2)}%`}
          was={wasConversion}
          now={conversion}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Revenue" note="Paid orders only.">
          <TrendChart data={revenue} dataKey="revenue_cents" label="Revenue" money />
        </Panel>
        <Panel title="Sessions" note="A session is one tab, counted once.">
          <TrendChart data={sessions} dataKey="sessions" label="Sessions" />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="How far people get" note="Sessions reaching each step.">
          <Funnel steps={funnel} />
        </Panel>

        <Panel title="Best sellers">
          {sellers.length === 0 ? (
            <Empty>Nothing sold in this period.</Empty>
          ) : (
            <ul className="flex flex-col gap-3">
              {sellers.map((seller) => (
                <li key={seller.id} className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-tile">
                    {seller.image_url ? (
                      <Image src={seller.image_url} alt="" fill sizes="40px" className="object-cover" />
                    ) : null}
                  </div>
                  <Link
                    href={`/products/${seller.slug}`}
                    className="min-w-0 flex-1 truncate text-sm text-olive-950 hover:underline dark:text-white"
                  >
                    {seller.name}
                  </Link>
                  <span className="shrink-0 text-sm text-olive-600 tabular-nums dark:text-olive-400">
                    {seller.sold} · {formatPrice(seller.revenue_cents)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Running low" note="Three left or fewer.">
        {low.length === 0 ? (
          <Empty>Everything is well stocked.</Empty>
        ) : (
          <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
            {low.map((product) => (
              <li key={product.id} className="flex items-baseline justify-between gap-4 text-sm">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="truncate text-olive-950 hover:underline dark:text-white"
                >
                  {product.name}
                </Link>
                <span
                  className={`shrink-0 tabular-nums ${
                    product.stock_quantity === 0
                      ? 'text-red-700 dark:text-red-400'
                      : 'text-olive-600 dark:text-olive-400'
                  }`}
                >
                  {product.stock_quantity === 0 ? 'Sold out' : `${product.stock_quantity} left`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}

function Panel({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-olive-950/10 p-5 dark:border-white/10">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-medium text-olive-950 dark:text-white">{title}</h2>
        {note && <p className="text-xs text-olive-600 dark:text-olive-400">{note}</p>}
      </div>
      {children}
    </section>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-olive-600 dark:text-olive-400">{children}</p>
}

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((card) => (
          <Skeleton key={card} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  )
}
