'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition, type FormEvent } from 'react'

const LIMIT = 100

/**
 * Filters as you type, like the shop's search box, and stays a plain GET form so every
 * filtered view is a URL that still works with JavaScript off.
 */
export function SearchFilters({
  action,
  placeholder,
  defaults,
  selects = [],
}: {
  action: string
  placeholder: string
  defaults: { q?: string }
  selects?: { name: string; label: string; value?: string; options: { value: string; label: string }[] }[]
}) {
  const form = useRef<HTMLFormElement>(null)
  const [value, setValue] = useState(defaults.q ?? '')
  const [pending, start] = useTransition()
  const router = useRouter()

  // A primitive, not the defaults object: a fresh identity each render relooped the effect
  // on the shop's search box and flooded the server.
  const applied = defaults.q ?? ''

  useEffect(() => {
    const wanted = value.trim().slice(0, LIMIT)
    // Already showing this query, so there is nothing to ask for.
    if (wanted === applied) return

    // A pause rather than a keystroke, or every letter is a round trip.
    const timer = setTimeout(() => {
      // Read at fire time, so whatever the selects hold now rides along with the query.
      const search = new URLSearchParams()
      if (form.current) {
        for (const [key, entry] of new FormData(form.current).entries()) {
          if (key !== 'q' && typeof entry === 'string' && entry) search.set(key, entry)
        }
      }
      if (wanted) search.set('q', wanted)
      const query = search.toString()
      start(() => router.replace(query ? `${action}?${query}` : action, { scroll: false }))
    }, 300)
    return () => clearTimeout(timer)
  }, [value, applied, action, router])

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const search = new URLSearchParams()
    for (const [key, entry] of new FormData(event.currentTarget).entries()) {
      if (typeof entry === 'string' && entry) search.set(key, entry)
    }
    const query = search.toString()
    start(() => router.replace(query ? `${action}?${query}` : action, { scroll: false }))
  }

  const field =
    'rounded-lg border border-olive-300 bg-transparent px-3 py-1.5 text-sm text-olive-950 placeholder:text-olive-500 focus:ring-2 focus:ring-ring focus:outline-none dark:border-olive-800 dark:text-white'

  return (
    <form ref={form} action={action} onSubmit={apply} className="flex flex-wrap items-center gap-3">
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={LIMIT}
        placeholder={placeholder}
        aria-label={placeholder}
        className={`${field} w-56`}
      />
      {selects.map((select) => (
        <select
          key={select.name}
          name={select.name}
          defaultValue={select.value ?? ''}
          aria-label={select.label}
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
          className={`${field} pr-8`}
        >
          <option value="">{select.label}</option>
          {select.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      <span aria-live="polite" className="sr-only">
        {pending ? 'Filtering' : ''}
      </span>
      {/* Only reachable without JavaScript; typing already navigates otherwise. */}
      <noscript>
        <button
          type="submit"
          className="rounded-lg border border-olive-300 px-3 py-1.5 text-sm text-olive-700 dark:border-olive-800 dark:text-olive-300"
        >
          Filter
        </button>
      </noscript>
    </form>
  )
}
