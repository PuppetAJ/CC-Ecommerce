import { Suspense } from 'react'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'
import { ButtonLink } from '@/components/elements/button'
import { QuickActions } from '@/app/_components/quick-actions'
import { ProductGrid, ProductGridSkeleton } from '@/features/products/components/product-grid'
import { requireUser } from '@/lib/auth/session'
import { listFavorites } from '@/lib/db/queries/favorites'

export const metadata = { title: 'Favorites' }

export const instant = false

export default function Page() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Heading>Favorites</Heading>
        <Text>
          <p>Things you have saved, newest first.</p>
        </Text>
      </div>
      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <Saved />
      </Suspense>
    </div>
  )
}

async function Saved() {
  const user = await requireUser()
  const products = await listFavorites(user.id)

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-start gap-6">
        <Text size="lg" className="max-w-xl">
          <p>Nothing saved yet. The heart on any product tile puts it here.</p>
        </Text>
        <ButtonLink href="/shop" size="lg">
          Browse the collection
        </ButtonLink>
      </div>
    )
  }

  return (
    <ProductGrid
      products={products}
      actions={(product) => (
        <QuickActions productId={product.id} name={product.name} soldOut={product.stock_quantity === 0} favorited />
      )}
    />
  )
}
