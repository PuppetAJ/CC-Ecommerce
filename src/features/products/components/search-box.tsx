'use client'

import { SearchIcon } from 'lucide-react'
import { useDebouncedQuery } from '@/components/use-debounced-query'
import { searchMaxLength, shopHref, type ShopSearch } from '../schemas'

/** Filters as you type against a trigram index, and stays a real GET form without JavaScript. */
export function SearchBox({ search }: { search: ShopSearch }) {
  const withoutQuery = shopHref({ ...search, q: undefined })
  const { value, setValue, pending } = useDebouncedQuery({
    applied: search.q ?? '',
    maxLength: searchMaxLength,
    build: (wanted) => {
      const [path, existing = ''] = withoutQuery.split('?')
      const params = new URLSearchParams(existing)
      if (wanted) params.set('q', wanted)
      const query = params.toString()
      return query ? `${path}?${query}` : path
    },
  })

  return (
    <form action="/shop" className="relative flex w-full items-center gap-2 sm:w-auto">
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
        className="w-full rounded-lg border border-olive-300 bg-transparent py-1.5 pr-9 pl-3 text-sm text-olive-950 placeholder:text-olive-500 focus:ring-2 focus:ring-ring focus:outline-none sm:w-56 dark:border-olive-800 dark:text-white"
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
