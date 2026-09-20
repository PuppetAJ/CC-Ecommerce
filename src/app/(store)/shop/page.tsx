import { Container } from '@/components/elements/container'
import { Skeleton } from '@/components/ui/skeleton'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'
import { QuickActions } from '@/app/_components/quick-actions'
import { ProductGrid, ProductGridSkeleton } from '@/features/products/components/product-grid'
import { FacetFilters } from '@/features/products/components/facet-filters'
import { ShopToolbar } from '@/features/products/components/shop-toolbar'
import { getCatalogue, getFacets } from '@/features/products/data'
import { fromShop, shopSearchSchema } from '@/features/products/schemas'
import { getSession } from '@/lib/auth/session'
import { listFavoriteIds } from '@/lib/db/queries/favorites'
import { summariseMany } from '@/lib/db/queries/reviews'
import { Stars } from '@/features/reviews/components/stars'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata = {
  title: 'Shop',
  description: 'Stoneware and timber, thrown, turned and joined by hand in small batches.',
}

export default function ShopPage({ searchParams }: PageProps<'/shop'>) {
  return (
    <Container className="flex flex-col gap-10 py-16">
      <div className="flex flex-col gap-4">
        <Heading>The collection</Heading>
        <Text size="lg" className="max-w-2xl">
          <p>Everything we make, in the batch that is currently out of the kiln.</p>
        </Text>
      </div>
      {/* searchParams is request data, so it is read below a boundary and the heading above prerenders. */}
      <Suspense fallback={<ShopSkeleton />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </Container>
  )
}

async function Results({ searchParams }: Pick<PageProps<'/shop'>, 'searchParams'>) {
  const search = shopSearchSchema.parse(await searchParams)
  const [products, facets] = await Promise.all([getCatalogue(search), getFacets()])

  // One query for the whole grid rather than one per tile.
  const session = await getSession()
  const favorites = new Set(session ? await listFavoriteIds(session.user.id) : [])
  const ratings = await summariseMany(products.map((product) => product.id))

  return (
    <div className="flex flex-col gap-10">
      <ShopToolbar search={search} count={products.length} />
      <div className="grid gap-10 lg:grid-cols-[12rem_1fr] lg:gap-12">
        <FacetFilters search={search} facets={facets} />
        <div className="min-w-0">
          {products.length > 0 ? (
            <ProductGrid
              products={products}
              from={fromShop(search)}
              rating={(product) => {
                const summary = ratings.get(product.id)
                if (!summary) return null
                return (
                  <div className="flex items-center gap-1.5 text-xs text-olive-600 dark:text-olive-400">
                    <Stars rating={summary.average} />
                    <span>({summary.count})</span>
                  </div>
                )
              }}
              actions={(product) => (
                <QuickActions
                  productId={product.id}
                  name={product.name}
                  soldOut={product.stock_quantity === 0}
                  favorited={favorites.has(product.id)}
                />
              )}
            />
          ) : (
            <EmptyState query={search.q} />
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ query }: { query?: string }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-olive-300 px-6 py-16 dark:border-olive-800">
      <p className="text-olive-950 dark:text-white">
        {query ? <>Nothing matches &ldquo;{query}&rdquo;.</> : 'Nothing here yet.'}
      </p>
      <Text>
        <p>The kiln is small and the shelves change often. Try a different search, or browse everything.</p>
      </Text>
      <Link href="/shop" className="text-sm text-olive-700 underline underline-offset-4 dark:text-olive-300">
        Browse everything
      </Link>
    </div>
  )
}

// Mirrors Results, so the rail and the grid land where the skeleton already put them.
function ShopSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-2">
          {/* Literal classes: Tailwind cannot see a width it has to compute. */}
          {['w-24', 'w-24', 'w-16', 'w-20', 'w-24'].map((width, index) => (
            <Skeleton key={index} className={`h-8 rounded-full ${width}`} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Skeleton className="h-9 w-56 rounded-lg" />
          <Skeleton className="h-9 w-44 rounded-lg" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="grid gap-10 lg:grid-cols-[12rem_1fr] lg:gap-12">
        <div className="flex flex-col gap-8">
          {[4, 7].map((rows, group) => (
            <div key={group} className="flex flex-col gap-3">
              <Skeleton className="h-5 w-20" />
              {Array.from({ length: rows }, (_, row) => (
                <div key={row} className="flex items-center gap-2.5">
                  <Skeleton className="size-4 rounded-sm" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="min-w-0">
          <ProductGridSkeleton />
        </div>
      </div>
    </div>
  )
}
