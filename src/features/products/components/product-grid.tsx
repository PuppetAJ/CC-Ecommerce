import type { Product } from '@/lib/db/types'
import { ProductCard, ProductCardSkeleton } from './product-card'

const grid = 'grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4'

export function ProductGrid({ products, from }: { products: Product[]; from?: string }) {
  return (
    <div className={grid}>
      {products.map((product, i) => (
        // The first row is above the fold on every breakpoint we support.
        <ProductCard key={product.id} product={product} priority={i < 4} from={from} />
      ))}
    </div>
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
