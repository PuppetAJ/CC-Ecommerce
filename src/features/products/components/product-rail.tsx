import { Carousel } from '@/components/elements/carousel'
import type { Product } from '@/lib/db/types'
import { ProductCard, railSizes } from './product-card'

export function ProductRail({
  products,
  from,
  title,
}: {
  products: Product[]
  from?: string
  title?: React.ReactNode
}) {
  return (
    <Carousel
      title={title}
      itemClassName="w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
      previousLabel="Previous products"
      nextLabel="More products"
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} from={from} sizes={railSizes} eager={index < 4} />
      ))}
    </Carousel>
  )
}
