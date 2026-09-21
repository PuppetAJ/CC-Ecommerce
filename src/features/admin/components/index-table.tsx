import type { ReactNode } from 'react'

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
    <div className="overflow-x-auto rounded-xl border border-olive-950/10 dark:border-white/10">
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
    </div>
  )
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
