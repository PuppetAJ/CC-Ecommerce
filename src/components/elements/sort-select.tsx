'use client'

import { useRouter } from 'next/navigation'
import { useId, useTransition } from 'react'
import { control } from './control'

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
  const [, start] = useTransition()
  return (
    <div className="flex min-w-0 items-center gap-2">
      {/* Read out but not drawn on a phone, where the words cost the select the room for its option. */}
      <label htmlFor={id} className="sr-only text-sm text-olive-600 sm:not-sr-only dark:text-olive-400">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const next = options.find((option) => option.value === event.target.value)
          if (!next) return
          // In a transition, or the fallback below shrinks the document and the browser clamps the scroll.
          start(() => router.push(scroll ? next.href : next.href.split('#')[0], { scroll }))
        }}
        className={`${control} min-w-0 py-1.5 pr-8 pl-3`}
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
