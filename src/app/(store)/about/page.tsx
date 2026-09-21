import type { Metadata } from 'next'
import Image from 'next/image'
import { ButtonLink } from '@/components/elements/button'
import { Container } from '@/components/elements/container'
import { Eyebrow } from '@/components/elements/eyebrow'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { Rise } from '@/components/motion'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { HeroSimpleCentered } from '@/components/sections/hero-simple-centered'
import { Stat, StatsThreeColumnWithDescription } from '@/components/sections/stats-three-column-with-description'
import { TestimonialTwoColumnWithLargePhoto } from '@/components/sections/testimonial-two-column-with-large-photo'

export const metadata: Metadata = {
  title: 'About',
  description: 'Two makers, four materials, and a kiln that decides what the rest of the week looks like.',
}

export default function AboutPage() {
  return (
    <>
      <HeroSimpleCentered
        eyebrow="The studio"
        headline="Named after a tree."
        subheadline={
          <p>
            The wicken tree, rowan to most people, was the one planted by the door to keep harm out of the house. It
            seemed a reasonable thing to name a workshop after.
          </p>
        }
        cta={<ButtonLink href="/shop">See what we make</ButtonLink>}
      />

      <Container>
        <Rise className="relative aspect-3/2 overflow-hidden rounded-xl bg-tile sm:aspect-21/9">
          <Image
            src="/images/editorial-shelf.jpg"
            alt="A painted shelf of unglazed vases and bottles, drying before they are fired"
            fill
            priority
            sizes="(min-width: 1280px) 1200px, 96vw"
            className="object-cover"
          />
        </Rise>
      </Container>

      <Step
        id="made"
        eyebrow="Mornings"
        headline="Clay, while the light is flat"
        image="/images/editorial-wheel.jpg"
        alt="Hands smoothing the rim of a tall jar on a wheel with a wet sponge"
      >
        <p>
          Everything begins on the wheel. A batch is whatever one person can throw between opening up and lunch, which
          is where the batch sizes come from: they are not a marketing decision, they are how many pots fit in a
          morning.
        </p>
        <p>
          Pieces dry on the shelf for a week, get turned, get glazed, and wait for a kiln that is only worth firing
          full. That is why a sold out piece takes a fortnight to come back rather than an afternoon.
        </p>
      </Step>

      <Step
        eyebrow="Afternoons"
        headline="Timber, and a lot of measuring"
        image="/images/editorial-timber.jpg"
        alt="A hand marking a pine board with a pencil, surrounded by shavings and a chisel"
        reversed
      >
        <p>
          Oak, ash, elm and a little walnut, bought as boards rather than sheets and cut down here. Joints are cut to be
          taken apart again, because a chair that cannot be repaired is a chair with an expiry date.
        </p>
        <p>
          Nothing is lacquered. Oil marks more easily and needs doing again every few years, which people sometimes hold
          against us, but it means a scratch sands out instead of being permanent.
        </p>
      </Step>

      <TestimonialTwoColumnWithLargePhoto
        quote={
          <>
            <p>
              I bought two mugs in 2021 expecting them to be the nice ones you keep in the cupboard. They have been in
              daily use ever since. Four winters, a house move and a toddler, and not a chip between them.
            </p>
          </>
        }
        img={
          <Image
            src="/images/editorial-studio.jpg"
            alt="A wall shelf of pottery and books above a scrubbed wooden table in a calm, warm room"
            width={1600}
            height={1058}
            sizes="(min-width: 1024px) 50vw, 96vw"
            className="w-full"
          />
        }
        name="Maren Solheim"
        byline="Bought two mugs in 2021, and rather more since"
      />

      <StatsThreeColumnWithDescription
        heading="A studio, not a warehouse"
        description={
          <p>
            We would rather make fewer things properly. The numbers below are the whole operation, and we intend to keep
            it that way.
          </p>
        }
      >
        <Stat stat="2" text="makers" />
        <Stat stat="4" text="materials, no more" />
        <Stat stat="0" text="pieces made offshore" />
      </StatsThreeColumnWithDescription>

      <CallToActionSimple
        headline="Come and see."
        subheadline={<p>The workshop is open on the first Saturday of the month, and email is answered faster.</p>}
        cta={<ButtonLink href="/help">Visit, or ask us something</ButtonLink>}
      />
    </>
  )
}

/** A photograph beside a couple of paragraphs, alternating sides down the page. */
function Step({
  id,
  eyebrow,
  headline,
  image,
  alt,
  reversed = false,
  children,
}: {
  id?: string
  eyebrow: string
  headline: string
  image: string
  alt: string
  reversed?: boolean
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Rise className={`relative aspect-4/3 overflow-hidden rounded-xl bg-tile ${reversed ? 'lg:order-2' : ''}`}>
          <Image src={image} alt={alt} fill sizes="(min-width: 1024px) 45vw, 92vw" className="object-cover" />
        </Rise>
        <Rise className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Eyebrow>{eyebrow}</Eyebrow>
            <Subheading>{headline}</Subheading>
          </div>
          <Text className="flex flex-col gap-4 text-pretty">{children}</Text>
        </Rise>
      </Container>
    </section>
  )
}
