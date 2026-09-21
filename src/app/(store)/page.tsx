import { Suspense } from 'react'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { Categories, CategoriesSkeleton } from '@/app/(store)/_components/categories'
import { Featured, FeaturedSkeleton } from '@/app/(store)/_components/featured'
import { HowItIsMade } from '@/app/(store)/_components/how-it-is-made'
import { LandingHero } from '@/app/(store)/_components/hero'
import { Voices, VoicesSkeleton } from '@/app/(store)/_components/voices'

export default function HomePage() {
  return (
    <>
      <LandingHero />
      {/* Each band reads the database, so each gets its own boundary and the hero is never
          waiting on the catalog to be counted. */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <Categories />
      </Suspense>
      <Suspense fallback={<FeaturedSkeleton />}>
        <Featured />
      </Suspense>
      <HowItIsMade />
      <Suspense fallback={<VoicesSkeleton />}>
        <Voices />
      </Suspense>

      <CallToActionSimple
        tight
        reveal
        headline="Come and visit."
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
              Visit or ask <ArrowNarrowRightIcon />
            </PlainButtonLink>
          </div>
        }
      />
    </>
  )
}
