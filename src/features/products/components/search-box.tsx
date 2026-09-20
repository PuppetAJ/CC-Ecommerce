'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
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
  const typed = useRef(false)

  useEffect(() => {
    if (!typed.current) return

    // A pause rather than a keystroke, or every letter is a round trip.
    const timer = setTimeout(() => {
      start(() => router.replace(shopHref({ ...search, q: value.trim() || undefined }), { scroll: false }))
    }, 250)
    return () => clearTimeout(timer)
  }, [value, search, router])

  return (
    <form action="/shop" className="flex items-center gap-2">
      {search.category && <input type="hidden" name="category" value={search.category} />}
      {search.sort !== 'newest' && <input type="hidden" name="sort" value={search.sort} />}
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => {
          typed.current = true
          setValue(event.target.value)
        }}
        placeholder="Search the collection"
        aria-label="Search the collection"
        className="w-56 rounded-lg border border-olive-300 bg-transparent px-3 py-1.5 text-sm text-olive-950 placeholder:text-olive-500 focus:ring-2 focus:ring-ring focus:outline-none dark:border-olive-800 dark:text-white"
      />
      <span aria-live="polite" className="sr-only">
        {pending ? 'Searching' : ''}
      </span>
      {/* Only reachable without JavaScript; typing already submits otherwise. */}
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
