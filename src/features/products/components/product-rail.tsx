'use client'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '@/lib/db/types'
import { ProductCard } from './product-card'

export function ProductRail({ products, from }: { products: Product[]; from?: string }) {
  const rail = useRef<HTMLUListElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  function measure() {
    const element = rail.current
    if (!element) return
    setAtStart(element.scrollLeft <= 1)
    setAtEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth - 1)
  }

  useEffect(() => {
    measure()
    const element = rail.current
    if (!element) return
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Scrolls by whole cards, so a card is never left cut in half at the edge.
  function page(direction: -1 | 1) {
    const element = rail.current
    if (!element) return
    const card = element.firstElementChild?.clientWidth ?? element.clientWidth
    const gap = 24
    const perPage = Math.max(1, Math.round(element.clientWidth / (card + gap)))
    element.scrollBy({ left: direction * perPage * (card + gap), behavior: 'smooth' })
  }

  const hasOverflow = !(atStart && atEnd)
  const arrow =
    'inline-flex size-9 items-center justify-center rounded-full border border-olive-950/10 text-olive-700 transition-colors hover:bg-olive-950/5 disabled:opacity-30 disabled:hover:bg-transparent dark:border-white/15 dark:text-olive-400 dark:hover:bg-white/10'

  return (
    <div className="flex flex-col gap-4">
      {hasOverflow && (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => page(-1)}
            disabled={atStart}
            aria-label="Previous products"
            className={arrow}
          >
            <ChevronLeftIcon className="size-4" />
          </button>
          <button type="button" onClick={() => page(1)} disabled={atEnd} aria-label="More products" className={arrow}>
            <ChevronRightIcon className="size-4" />
          </button>
        </div>
      )}
      <ul
        ref={rail}
        onScroll={measure}
        className="-mx-6 flex snap-x snap-mandatory [scrollbar-width:none] gap-6 overflow-x-auto scroll-smooth px-6 pb-2 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <li key={product.id} className="w-[calc(50%-12px)] shrink-0 snap-start lg:w-[calc(25%-18px)]">
            <ProductCard product={product} from={from} />
          </li>
        ))}
      </ul>
    </div>
  )
}
