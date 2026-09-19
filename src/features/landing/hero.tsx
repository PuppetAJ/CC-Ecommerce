import { AnnouncementBadge } from '@/components/elements/announcement-badge'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { ArrowNarrowRightIcon } from '@/components/icons/arrow-narrow-right-icon'
import { HeroTwoColumnWithPhoto } from '@/components/sections/hero-two-column-with-photo'
import Image from 'next/image'

export function LandingHero() {
  return (
    <HeroTwoColumnWithPhoto
      tallPhoto
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
      photo={
        <Image
          src="/images/hero-teaware.jpg"
          alt="Stoneware cups and shallow bowls on a table against an olive wall, in low afternoon light"
          width={1600}
          height={1060}
          priority
          className="w-full"
        />
      }
    />
  )
}
