import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { PhotoPlaceholder } from '@/components/photo-placeholder'
import { CallToActionSimple } from '@/components/sections/call-to-action-simple'
import { Feature, FeaturesThreeColumn } from '@/components/sections/features-three-column'
import { HeroTwoColumnWithPhoto } from '@/components/sections/hero-two-column-with-photo'
import { Stat, StatsThreeColumnWithDescription } from '@/components/sections/stats-three-column-with-description'

export default function HomePage() {
  return (
    <>
      <HeroTwoColumnWithPhoto
        eyebrow={
          <AnnouncementBadge
            href="/about"
            text={<>&ldquo;Four winters of daily use, not a chip.&rdquo;</>}
            cta="Read Maren's story"
          />
        }
        headline="Made slowly, to be kept."
        subheadline={
          <p>
            Wicken is a small studio working in clay and timber. Everything is thrown, turned or joined by hand, in
            batches small enough that we know each piece.
          </p>
        }
        cta={
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href="/shop" size="lg">
              Shop the collection
            </ButtonLink>
            <PlainButtonLink href="/about" size="lg">
              See how it&rsquo;s made <ArrowNarrowRightIcon />
            </PlainButtonLink>
          </div>
        }
        photo={<PhotoPlaceholder label="Hero photograph" className="aspect-4/3" />}
      />

      <FeaturesThreeColumn
        features={
          <>
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
          </>
        }
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
        <Stat stat="3" text="kilns, fired weekly" />
        <Stat stat="120" text="pieces in a good month" />
        <Stat stat="1974" text="the year the workshop opened" />
      </StatsThreeColumnWithDescription>

      <CallToActionSimple
        headline="Start with one good thing."
        subheadline={<p>A mug you reach for every morning is a better beginning than a whole dinner service.</p>}
        cta={<ButtonLink href="/shop">Browse everything</ButtonLink>}
      />
    </>
  )
}
