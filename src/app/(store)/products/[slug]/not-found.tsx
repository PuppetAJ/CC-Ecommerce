import { ButtonLink } from '@/components/elements/button'
import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'

export default function ProductNotFound() {
  return (
    <Container className="flex flex-col items-start gap-6 py-32">
      <Heading>We do not make that one.</Heading>
      <Text size="lg" className="max-w-xl">
        <p>
          The piece you are looking for has either sold out for good or never existed. The shelves that are full are
          through here.
        </p>
      </Text>
      <ButtonLink href="/shop" size="lg">
        Browse the collection
      </ButtonLink>
    </Container>
  )
}
