'use client'

import { useRouter } from 'next/navigation'
import { useTransition, type FormEvent } from 'react'

/**
 * A plain GET form, so every filtered view is a URL and the page still works without
 * JavaScript. With it, the submit is replayed through the router to keep the scroll.
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
  const [pending, start] = useTransition()
  const router = useRouter()

  function apply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const params = new URLSearchParams()
    for (const [key, value] of new FormData(event.currentTarget).entries()) {
      if (typeof value === 'string' && value) params.set(key, value)
    }
    const query = params.toString()
    start(() => router.replace(query ? `${action}?${query}` : action, { scroll: false }))
  }

  const field =
    'rounded-lg border border-olive-300 bg-transparent px-3 py-1.5 text-sm text-olive-950 placeholder:text-olive-500 focus:ring-2 focus:ring-ring focus:outline-none dark:border-olive-800 dark:text-white'

  return (
    <form action={action} onSubmit={apply} className="flex flex-wrap items-center gap-3">
      <input type="search" name="q" defaultValue={defaults.q ?? ''} placeholder={placeholder} aria-label={placeholder} className={`${field} w-56`} />
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
      <button
        type="submit"
        className="rounded-lg border border-olive-300 px-3 py-1.5 text-sm text-olive-700 disabled:opacity-50 dark:border-olive-800 dark:text-olive-300"
        disabled={pending}
      >
        {pending ? 'Filtering…' : 'Filter'}
      </button>
    </form>
  )
}
