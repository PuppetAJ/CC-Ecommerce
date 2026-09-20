import { Container } from '@/components/elements/container'
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

function ShopSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <div className="h-24" />
      <ProductGridSkeleton />
    </div>
  )
}
