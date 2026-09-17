import type { Metadata } from 'next'
import { ButtonLink } from '@/components/elements/button'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { HeroSimpleCentered } from '@/components/sections/hero-simple-centered'
import { Stat, StatsThreeColumnWithDescription } from '@/components/sections/stats-three-column-with-description'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <>
      <HeroSimpleCentered
        eyebrow="The studio"
        headline="Named after a tree."
        subheadline={
          <p>
            The wicken tree — rowan, to most people — was the one planted by the door to keep harm out of the house. It
            seemed a reasonable thing to name a workshop after.
          </p>
        }
        cta={<ButtonLink href="/shop">See what we make</ButtonLink>}
      />
      <StatsThreeColumnWithDescription
        heading="How we work"
        description={
          <p>
            Clay in the morning, timber in the afternoon, and a kiln that dictates the rest of the week. Nothing is
            outsourced and nothing is made in quantities we cannot check by hand.
          </p>
        }
      >
        <Stat stat="2" text="makers" />
        <Stat stat="4" text="materials, no more" />
        <Stat stat="0" text="pieces made offshore" />
      </StatsThreeColumnWithDescription>
      <CallToActionSimple
        headline="Come and see."
        subheadline={<p>The workshop is open on the first Saturday of the month.</p>}
        cta={<ButtonLink href="/faq">Read the FAQ</ButtonLink>}
      />
    </>
  )
}
