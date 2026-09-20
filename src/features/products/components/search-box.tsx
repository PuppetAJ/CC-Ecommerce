'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { shopHref, type ShopSearch } from '../schemas'

/**
 * Filters as you type. Fine at this size — a few dozen products and a LIKE query — and
 * honestly wrong at ten thousand, where this belongs in a search index instead.
 *
 * It stays a real GET form so search still works with JavaScript off; the typing is the
 * enhancement on top.
 */
export function SearchBox({ search }: { search: ShopSearch }) {
  const [value, setValue] = useState(search.q ?? '')
  const [pending, start] = useTransition()
  const router = useRouter()

  // Primitives, not the `search` object. Depending on the object meant a fresh identity
  // every render, so each navigation re-ran this effect and scheduled another — a loop
  // that flooded the server on every keystroke. A string is stable by value.
  const applied = search.q ?? ''
  const withoutQuery = shopHref({ ...search, q: undefined })

  useEffect(() => {
    const wanted = value.trim()
    // Already showing this query, so there is nothing to ask for.
    if (wanted === applied) return

    // A pause rather than a keystroke, or every letter is a round trip.
    const timer = setTimeout(() => {
      const [path, existing = ''] = withoutQuery.split('?')
      const params = new URLSearchParams(existing)
      if (wanted) params.set('q', wanted)
      const query = params.toString()
      start(() => router.replace(query ? `${path}?${query}` : path, { scroll: false }))
    }, 300)
    return () => clearTimeout(timer)
  }, [value, applied, withoutQuery, router])

  return (
    <form action="/shop" className="flex items-center gap-2">
      {search.category && <input type="hidden" name="category" value={search.category} />}
      {search.sort !== 'newest' && <input type="hidden" name="sort" value={search.sort} />}
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search the collection"
        aria-label="Search the collection"
        className="w-56 rounded-lg border border-olive-300 bg-transparent px-3 py-1.5 text-sm text-olive-950 placeholder:text-olive-500 focus:ring-2 focus:ring-ring focus:outline-none dark:border-olive-800 dark:text-white"
      />
      <span aria-live="polite" className="sr-only">
        {pending ? 'Searching' : ''}
      </span>
      {/* Only reachable without JavaScript; typing already navigates otherwise. */}
      <noscript>
        <button
          type="submit"
          className="rounded-lg border border-olive-300 px-3 py-1.5 text-sm text-olive-700 dark:border-olive-800 dark:text-olive-300"
        >
          Search
        </button>
      </noscript>
    </form>
  )
}
