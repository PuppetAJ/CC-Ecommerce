import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { Categories } from '@/app/(store)/_components/categories'
import { Featured } from '@/app/(store)/_components/featured'
import { HowItIsMade } from '@/app/(store)/_components/how-it-is-made'
import { LandingHero } from '@/app/(store)/_components/hero'
import { Voices } from '@/app/(store)/_components/voices'

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <Categories />
      <Featured />
      <HowItIsMade />
      <Voices />

      <CallToActionSimple
        headline="Come and see."
        subheadline={
          <p>
            The workshop is open on the first Saturday of the month. Everything else we answer by email, usually the
            same day.
          </p>
        }
        cta={
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href="/shop" size="lg">
              Shop the collection
            </ButtonLink>
            <PlainButtonLink href="/help" size="lg">
              Visit or ask
            </PlainButtonLink>
          </div>
        }
      />
    </>
  )
}
