import type { ReactNode } from 'react'
import { Stagger } from '@/components/motion'
import type { Product } from '@/lib/db/types'
import { ProductCard, ProductCardSkeleton } from './product-card'

const grid = 'grid grid-cols-1 gap-x-6 gap-y-10 min-[400px]:grid-cols-2 lg:grid-cols-4'

export function ProductGrid({
  products,
  from,
  // A slot, so the grid stays ignorant of the cart and favorites it would otherwise
  // have to import across a feature boundary.
  actions,
  rating,
}: {
  products: Product[]
  from?: string
  actions?: (product: Product) => ReactNode
  rating?: (product: Product) => ReactNode
}) {
  return (
    // Server-rendered tiles handed to a client wrapper: the cards stay on the server and only
    // the wrapper ships.
    <Stagger className={grid}>
      {products.map((product, i) => (
        // The first row is above the fold on every breakpoint we support.
        <ProductCard
          key={product.id}
          product={product}
          priority={i < 4}
          from={from}
          actions={actions?.(product)}
          rating={rating?.(product)}
        />
      ))}
    </Stagger>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={grid}>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
