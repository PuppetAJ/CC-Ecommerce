import { categories } from '@/lib/db/types'
import { clsx } from 'clsx/lite'
import Link from 'next/link'
import { categoryLabels, shopHref, sortLabels, sorts, type ShopSearch } from '../schemas'
import { SortSelect } from './sort-select'

export function ShopToolbar({ search, count }: { search: ShopSearch; count: number }) {
  const filtered = Boolean(search.category || search.q)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <CategoryLink href={shopHref({ ...search, category: undefined })} active={!search.category}>
          Everything
        </CategoryLink>
        {categories.map((category) => (
          <CategoryLink
            key={category}
            href={shopHref({ ...search, category })}
            active={search.category === category}
          >
            {categoryLabels[category]}
          </CategoryLink>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* A plain GET form, so search works with JavaScript disabled. */}
        <form action="/shop" className="flex items-center gap-2">
          {search.category && <input type="hidden" name="category" value={search.category} />}
          {search.sort !== 'newest' && <input type="hidden" name="sort" value={search.sort} />}
          <input
            type="search"
            name="q"
            defaultValue={search.q ?? ''}
            placeholder="Search the collection"
            aria-label="Search the collection"
            className="w-56 rounded-lg border border-olive-300 bg-transparent px-3 py-1.5 text-sm text-olive-950 placeholder:text-olive-500 focus:ring-2 focus:ring-ring focus:outline-none dark:border-olive-800 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-lg border border-olive-300 px-3 py-1.5 text-sm text-olive-700 hover:bg-olive-200/50 dark:border-olive-800 dark:text-olive-300 dark:hover:bg-olive-800/50"
          >
            Search
          </button>
        </form>

        <SortSelect
          value={search.sort}
          options={sorts.map((sort) => ({ value: sort, label: sortLabels[sort], href: shopHref({ ...search, sort }) }))}
        />
      </div>

      <div className="flex items-center gap-3 text-sm text-olive-600 dark:text-olive-400">
        <p>
          {count} {count === 1 ? 'piece' : 'pieces'}
        </p>
        {filtered && (
          <Link href="/shop" className="underline underline-offset-4 hover:text-olive-950 dark:hover:text-white">
            Clear all
          </Link>
        )}
      </div>
    </div>
  )
}

function CategoryLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'rounded-full px-3.5 py-1.5 text-sm transition-colors',
        active
          ? 'bg-olive-950 text-white dark:bg-white dark:text-olive-950'
          : 'border border-olive-300 text-olive-700 hover:bg-olive-200/50 dark:border-olive-800 dark:text-olive-300 dark:hover:bg-olive-800/50',
      )}
    >
      {children}
    </Link>
  )
}
