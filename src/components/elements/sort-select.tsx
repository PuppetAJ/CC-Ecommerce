'use client'

import { useRouter } from 'next/navigation'
import { useId } from 'react'

// Options carry their own hrefs so this stays a leaf: no searchParams read, no Suspense needed.
export function SortSelect({
  value,
  options,
  label = 'Sort',
  scroll = true,
}: {
  value: string
  options: { value: string; label: string; href: string }[]
  label?: string
  /** False where the control sits beside what it reorders, so choosing does not jump. */
  scroll?: boolean
}) {
  const router = useRouter()
  const id = useId()
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm text-olive-600 dark:text-olive-400">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const next = options.find((option) => option.value === event.target.value)
          if (next) router.push(next.href, { scroll })
        }}
        className="rounded-lg border border-olive-300 bg-transparent py-1.5 pr-8 pl-3 text-sm text-olive-950 focus:ring-2 focus:ring-ring focus:outline-none dark:border-olive-800 dark:text-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
