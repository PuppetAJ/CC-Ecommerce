import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/lib/db/types'
import { formatPrice } from '@/lib/format'
import { focalPosition } from '../focal'

// Square tiles keep 67% of a 3:2 photograph against 53% for a 4:5, so far less of each
// frame is discarded and fewer products need a focal point. The grid never reflows either.
const tile = 'relative aspect-square overflow-hidden rounded-xl bg-tile'

export function ProductCard({
  product,
  priority = false,
  from = '',
  actions,
}: {
  product: Product
  priority?: boolean
  from?: string
  actions?: ReactNode
}) {
  const soldOut = product.stock_quantity === 0

  return (
    // Not a Link wrapper: the quick actions are buttons, and a button inside an anchor is
    // invalid. The title carries a stretched link that covers the whole card instead.
    <article className="group relative flex flex-col gap-3">
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
        {actions}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-medium text-olive-950 dark:text-white">
          <Link
            href={`/products/${product.slug}${from}`}
            className="after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-olive-600 dark:text-olive-400">{formatPrice(product.price_cents)}</p>
      </div>
    </article>
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
