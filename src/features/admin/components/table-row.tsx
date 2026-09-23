import type { ComponentProps, ReactNode } from 'react'

// Kept apart from the table so a client row can use them without pulling in the server-only paging module.
export function Row({ children, className = '', ...props }: ComponentProps<'tr'>) {
  return (
    <tr className={`hover:bg-olive-950/[0.03] dark:hover:bg-white/[0.03] ${className}`} {...props}>
      {children}
    </tr>
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
