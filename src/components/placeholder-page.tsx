import { ButtonLink } from '@/components/elements/button'
import { HeroSimpleLeftAligned } from '@/components/sections/hero-simple-left-aligned'

// Every route exists from phase 1 so the shell is navigable; each is filled in its own phase.
export function PlaceholderPage({ title, phase }: { title: string; phase: string }) {
  return (
    <HeroSimpleLeftAligned
      eyebrow="Not built yet"
      headline={title}
      subheadline={<p>This page arrives in {phase}.</p>}
      cta={<ButtonLink href="/">Back home</ButtonLink>}
    />
  )
}
