import { Container } from '@/components/elements/container'
import { Skeleton } from '@/components/ui/skeleton'
import { ProductGridSkeleton } from '@/features/products/components/product-grid'

export default function ShopLoading() {
  return (
    <Container className="flex flex-col gap-10 py-16">
      <Skeleton className="h-14 w-80" />
      <ProductGridSkeleton />
    </Container>
  )
}
