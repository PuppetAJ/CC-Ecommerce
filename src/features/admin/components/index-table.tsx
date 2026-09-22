import type { ReactNode } from 'react'
import { Scroller } from '@/components/elements/scroller'
import { perPage } from '@/lib/db/queries/admin'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Shopify's resource index, in the shape their own guidance describes: one column, so the
 * hierarchy runs top to bottom and the row keeps its horizontal space for data. Each row
 * has one primary thing, one secondary, and a kicker that sits above both.
 */
export function IndexTable({
  columns,
  children,
  empty,
}: {
  columns: string[]
  children: ReactNode
  empty?: ReactNode
}) {
  const rows = Array.isArray(children) ? children.flat() : [children]
  if (rows.filter(Boolean).length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-olive-300 px-5 py-10 text-sm text-olive-600 dark:border-olive-800 dark:text-olive-400">
        {empty ?? 'Nothing here.'}
      </p>
    )
  }

  return (
    <Scroller className="rounded-xl border border-olive-950/10 dark:border-white/10">
      <table className="w-full min-w-3xl border-collapse text-sm">
        <thead>
          <tr className="border-b border-olive-950/10 dark:border-white/10">
            {columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={`px-4 py-3 font-medium text-olive-600 dark:text-olive-400 ${
                  index === 0 ? 'text-left' : index === columns.length - 1 ? 'text-right' : 'text-left'
                }`}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-olive-950/10 dark:divide-white/10">{children}</tbody>
      </table>
    </Scroller>
  )
}

export function Row({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <tr className={`hover:bg-olive-950/[0.03] dark:hover:bg-white/[0.03] ${className}`}>{children}</tr>
}

export function Cell({
  children,
  align = 'left',
  className = '',
}: {
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
}) {
  return <td className={`px-4 py-3 ${align === 'right' ? 'text-right' : ''} ${className}`}>{children}</td>
}

/** A full page of rows, so waiting for one does not shorten the page and then stretch it back. */
export function IndexTableSkeleton({ rows = perPage }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-olive-950/10 dark:border-white/10">
      <div className="border-b border-olive-950/10 px-4 py-3 dark:border-white/10">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="divide-y divide-olive-950/10 dark:divide-white/10">
        {Array.from({ length: rows }, (_, row) => (
          <div key={row} className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
