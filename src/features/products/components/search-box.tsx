'use client'

import { SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { searchMaxLength, shopHref, type ShopSearch } from '../schemas'

/**
 * Filters as you type, against a trigram index rather than a warm cache, so the cost does not
 * grow with how many distinct things people search for.
 *
 * It stays a real GET form so search still works with JavaScript off; the typing is the
 * enhancement on top.
 */
export function SearchBox({ search }: { search: ShopSearch }) {
  const [value, setValue] = useState(search.q ?? '')
  const [pending, start] = useTransition()
  const router = useRouter()

  // Primitives, not the `search` object: a fresh identity each render relooped the effect.
  const applied = search.q ?? ''
  const withoutQuery = shopHref({ ...search, q: undefined })

  useEffect(() => {
    // The schema's own bound: what it rejects comes back as no query, which never matches.
    const wanted = value.trim().slice(0, searchMaxLength)
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
    <form action="/shop" className="relative flex items-center gap-2">
      {search.category && <input type="hidden" name="category" value={search.category} />}
      {search.sort !== 'newest' && <input type="hidden" name="sort" value={search.sort} />}
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        maxLength={searchMaxLength}
        placeholder="Search the collection"
        aria-label="Search the collection"
        className="w-56 rounded-lg border border-olive-300 bg-transparent py-1.5 pr-9 pl-3 text-sm text-olive-950 placeholder:text-olive-500 focus:ring-2 focus:ring-ring focus:outline-none dark:border-olive-800 dark:text-white"
      />
      <SearchIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-olive-500 dark:text-olive-500"
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
