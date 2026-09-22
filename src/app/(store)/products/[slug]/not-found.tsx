import { Container } from '@/components/elements/container'
import { EmptyState } from '@/components/elements/empty-state'

export default function ProductNotFound() {
  return (
    <Container className="py-32">
      <EmptyState heading="We do not make that one.">
        The piece you are looking for has either sold out for good or never existed. The shelves that are full are
        through here.
      </EmptyState>
    </Container>
  )
}
