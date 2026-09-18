import { Container } from '@/components/elements/container'
import { LandingHero } from '@/features/landing/hero'
import type { HeroPhoto } from '@/features/landing/hero'

// Temporary: side-by-side of the two hero candidates. Delete once one is chosen.
const options: { photo: HeroPhoto; label: string; note: string }[] = [
  {
    photo: 'teaware',
    label: 'B — olive wall, 58% column, full frame',
    note: 'Chanhee Lee. Carries the brand hue but is a soft film scan, so it is shown uncropped and never enlarged.',
  },
  {
    photo: 'windowsill',
    label: 'A — windowsill, 50/50 column',
    note: 'Danielle-Claude Bélanger. Sharpest of the shortlist and shows the product, but sits neutral against the palette.',
  },
]

export default function ComparePage() {
  return (
    <>
      {options.map(({ photo, label, note }) => (
        <div key={photo}>
          <Container className="pt-10">
            <p className="font-mono text-sm text-olive-600 dark:text-olive-400">{label}</p>
            <p className="mt-1 max-w-2xl text-sm text-olive-600 dark:text-olive-400">{note}</p>
          </Container>
          <LandingHero photo={photo} />
          <Container>
            <hr className="border-olive-300 dark:border-olive-800" />
          </Container>
        </div>
      ))}
    </>
  )
}
