import Image from 'next/image'
import { Container } from '@/components/elements/container'
import { Eyebrow } from '@/components/elements/eyebrow'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { Rise } from '@/components/motion'
import { Feature } from '@/components/sections/features-three-column'

/** The three claims the shop makes about itself, next to somebody actually making something. */
export function HowItIsMade() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Rise className="relative aspect-4/3 overflow-hidden rounded-xl bg-tile">
          <Image
            src="/images/editorial-throwing.jpg"
            alt="Two clay covered hands raising the wall of a small cylinder on a potter's wheel"
            fill
            sizes="(min-width: 1024px) 45vw, 92vw"
            className="object-cover"
          />
        </Rise>

        <Rise className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <Eyebrow>How it is made</Eyebrow>
            <Subheading>We make all of it ourselves</Subheading>
          </div>
          <Text className="text-pretty">
            <p>Two people, four materials, and a kiln that decides what the rest of the week looks like.</p>
          </Text>
          <div className="flex flex-col gap-6">
            <Feature
              headline="Fired in small batches"
              subheadline="Each glaze is mixed for the kiln it goes into, so no two pieces are quite alike."
            />
            <Feature
              headline="Timber that ages well"
              subheadline="Oak, ash and elm, finished with oil rather than lacquer so the surface can be repaired."
            />
            <Feature
              headline="Built to be mended"
              subheadline="Joinery you can take apart. We keep spares for everything we have ever sold."
            />
          </div>
        </Rise>
      </Container>
    </section>
  )
}
