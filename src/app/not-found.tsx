import { ButtonLink } from '@/components/elements/button'
import { HeroSimpleCentered } from '@/components/sections/hero-simple-centered'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSimpleCentered
          eyebrow="404"
          headline="That page is not here."
          subheadline={<p>It may have been packed away, or it may never have existed.</p>}
          cta={<ButtonLink href="/">Back home</ButtonLink>}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
