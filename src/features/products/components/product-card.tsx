import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/lib/db/types'
import { formatPrice } from '@/lib/format'
import Image from 'next/image'
import Link from 'next/link'
import { focalPosition } from '../focal'

// Every tile is 4:5 so the grid never reflows as images load.
const tile = 'relative aspect-4/5 overflow-hidden rounded-xl bg-tile'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const soldOut = product.stock_quantity === 0
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col gap-3">
      <div className={tile}>
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            style={{ objectPosition: focalPosition(product.slug) }}
            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
        {soldOut && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-olive-950">
            Sold out
          </span>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-olive-950 dark:text-white">{product.name}</h3>
        <p className="text-sm text-olive-600 dark:text-olive-400">{formatPrice(product.price_cents)}</p>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className={tile} />
      <div className="flex items-baseline justify-between gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  )
}
