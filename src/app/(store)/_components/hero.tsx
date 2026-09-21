import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { Enter } from '@/components/motion'
import { HeroTwoColumnWithPhoto } from '@/components/sections/hero-two-column-with-photo'
import Image from 'next/image'

// The first thing anybody sees, so it arrives a piece at a time rather than all at once. The
// photograph leads by a beat; the words catch up.
export function LandingHero() {
  return (
    <HeroTwoColumnWithPhoto
      tallPhoto
      eyebrow={
        <Enter delay={0.05}>
          <AnnouncementBadge
            href="/about"
            text={<>&ldquo;Four winters of daily use, not a chip.&rdquo;</>}
            cta="Read Maren's story"
          />
        </Enter>
      }
      headline={
        // A span, because a heading holds phrasing content and a div is not that.
        <Enter as="span" className="block" delay={0.12}>
          Made slowly, to be kept.
        </Enter>
      }
      subheadline={
        <Enter delay={0.2}>
          <p>
            Wicken is a small studio working in clay and wood, and a short list of makers we buy the rest from. Nothing
            here is made in a quantity we cannot check by hand.
          </p>
        </Enter>
      }
      cta={
        <Enter delay={0.28}>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonLink href="/shop" size="lg">
              Shop the collection
            </ButtonLink>
            <PlainButtonLink href="/about" size="lg">
              See how it&rsquo;s made <ArrowNarrowRightIcon />
            </PlainButtonLink>
          </div>
        </Enter>
      }
      photo={
        <Enter className="h-full w-full">
          <Image
            src="/images/hero-teaware.jpg"
            alt="Stoneware cups and shallow bowls on a table against an olive wall, in low afternoon light"
            width={1600}
            height={1060}
            priority
            className="h-full w-full object-cover"
          />
        </Enter>
      }
    />
  )
}
