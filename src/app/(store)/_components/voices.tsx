import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/elements/section'
import { Skeleton } from '@/components/ui/skeleton'
import { Stagger } from '@/components/motion'
import { Stars } from '@/features/reviews/components/stars'
import { getTestimonials } from '@/features/reviews/data'

/**
 * Quotes pulled from the reviews table rather than written for the landing page, so every one
 * of them is findable on the product it belongs to.
 */
export async function Voices() {
  const quotes = await getTestimonials(3)
  if (quotes.length < 3) return null

  return (
    <Section
      headline="What people say"
      subheadline={<p>Left on the pieces themselves, and still there if you go and look.</p>}
    >
      <Stagger className="grid gap-6 md:grid-cols-3">
        {quotes.map((quote) => (
          <figure
            key={quote.product_slug}
            className="flex h-full flex-col gap-5 rounded-xl bg-olive-950/2.5 p-6 dark:bg-white/5"
          >
            <Stars rating={quote.rating} />
            <blockquote className="flex-1 text-pretty text-olive-950 dark:text-white">
              &ldquo;{quote.body}&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-tile">
                {quote.image_url && <Image src={quote.image_url} alt="" fill sizes="48px" className="object-cover" />}
              </span>
              <div className="min-w-0 text-sm">
                <p className="font-medium text-olive-950 dark:text-white">{quote.author}</p>
                <p className="truncate text-olive-600 dark:text-olive-400">
                  on{' '}
                  <Link href={`/products/${quote.product_slug}`} className="underline underline-offset-4">
                    {quote.product_name}
                  </Link>
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </Stagger>
    </Section>
  )
}

export function VoicesSkeleton() {
  return (
    <Section headline="What people say">
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton key={index} className="h-56 rounded-xl" />
        ))}
      </div>
    </Section>
  )
}
