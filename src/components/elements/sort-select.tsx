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
    <div className="flex min-w-0 items-center gap-2">
      {/* Read out but not drawn on a phone, where the words cost the select the room it needs
          to show the option it is set to. */}
      <label htmlFor={id} className="sr-only text-sm text-olive-600 sm:not-sr-only dark:text-olive-400">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const next = options.find((option) => option.value === event.target.value)
          if (next) router.push(next.href, { scroll })
        }}
        className="min-w-0 rounded-lg border border-olive-300 bg-transparent py-1.5 pr-8 pl-3 text-sm text-olive-950 focus:ring-2 focus:ring-ring focus:outline-none dark:border-olive-800 dark:text-white"
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
