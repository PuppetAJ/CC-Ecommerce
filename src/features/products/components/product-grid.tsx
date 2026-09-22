import type { ReactNode } from 'react'
import { Stagger } from '@/components/motion'
import type { Product } from '@/lib/db/types'
import { ProductCard, ProductCardSkeleton } from './product-card'

const grid = 'grid grid-cols-1 gap-x-6 gap-y-10 min-[400px]:grid-cols-2 lg:grid-cols-4'

export function ProductGrid({
  products,
  from,
  // A slot, so the grid never imports the cart or favorites across a feature boundary.
  actions,
  rating,
}: {
  products: Product[]
  from?: string
  actions?: (product: Product) => ReactNode
  rating?: (product: Product) => ReactNode
}) {
  return (
    // Server-rendered tiles handed to a client wrapper, so only the wrapper ships.
    <Stagger className={grid}>
      {products.map((product, i) => (
        // The rows behind the first are fetched early so no tile is still loading when its reveal plays.
        <ProductCard
          key={product.id}
          product={product}
          priority={i < 4}
          eager={i < 12}
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
