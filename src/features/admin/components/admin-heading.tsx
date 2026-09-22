import type { ReactNode } from 'react'

export function AdminHeading({ children }: { children: ReactNode }) {
  return <h1 className="font-display text-2xl font-medium text-olive-950 dark:text-white">{children}</h1>
}
