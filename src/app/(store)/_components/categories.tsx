import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/elements/section'
import { Stagger } from '@/components/motion'
import { getCategoryCovers } from '@/features/products/data'
import { focalPosition } from '@/features/products/focal'
import { categoryLabels } from '@/features/products/schemas'

// Six tiles across a 1200px container is 180px each, which is as small as a photograph can be
// and still say what it is.
const sizes = '(min-width: 1280px) 190px, (min-width: 1024px) 15vw, (min-width: 640px) 30vw, 45vw'

/** The way into the catalogue for somebody who does not yet know what they want. */
export async function Categories() {
  const covers = await getCategoryCovers()

  return (
    <Section headline="Six things we make" subheadline={<p>Clay and timber, and what comes of working in both.</p>}>
      <Stagger className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {covers.map((cover) => (
          <Link key={cover.category} href={`/shop?category=${cover.category}`} className="group flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-tile">
              {cover.image_url && (
                <Image
                  src={cover.image_url}
                  alt=""
                  fill
                  sizes={sizes}
                  style={{ objectPosition: focalPosition(cover.slug) }}
                  className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              )}
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-medium text-olive-950 group-hover:underline group-hover:underline-offset-4 dark:text-white">
                {categoryLabels[cover.category]}
              </h3>
              <span className="text-xs text-olive-600 tabular-nums dark:text-olive-400">{cover.count}</span>
            </div>
          </Link>
        ))}
      </Stagger>
    </Section>
  )
}
