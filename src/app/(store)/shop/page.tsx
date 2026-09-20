import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'
import { ProductGrid, ProductGridSkeleton } from '@/features/products/components/product-grid'
import { ShopToolbar } from '@/features/products/components/shop-toolbar'
import { getCatalogue } from '@/features/products/data'
import { fromShop, shopSearchSchema } from '@/features/products/schemas'
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
  const products = await getCatalogue(search)

  return (
    <div className="flex flex-col gap-10">
      <ShopToolbar search={search} count={products.length} />
      {products.length > 0 ? (
        <ProductGrid products={products} from={fromShop(search)} />
      ) : (
        <EmptyState query={search.q} />
      )}
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
