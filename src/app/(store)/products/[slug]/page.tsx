import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Suspense } from 'react'
import { FavoriteButton } from '@/app/_components/favorite-button'
import { AddToCart } from '@/features/cart/components/add-to-cart'
import { ReviewForm } from '@/features/reviews/components/review-form'
import { ReviewList } from '@/features/reviews/components/review-list'
import { Stars } from '@/features/reviews/components/stars'
import { Breadcrumbs } from '@/features/products/components/breadcrumbs'
import { ProductRail } from '@/features/products/components/product-rail'
import { ProductImage } from '@/features/products/components/product-image'
import { getProduct, getRelated } from '@/features/products/data'
import { focalPosition } from '@/features/products/focal'
import { categoryLabels, fromShop, shopSearchSchema } from '@/features/products/schemas'
import { Price } from '@/features/products/components/price'
import { getSession } from '@/lib/auth/session'
import { listFavoriteIds } from '@/lib/db/queries/favorites'
import { getOwnReview, listReviews, summariseReviews, type ReviewSort } from '@/lib/db/queries/reviews'
import { SortSelect } from '@/components/elements/sort-select'
import { reviewSortLabels, reviewSorts, reviewSortSchema, reviewsHref } from '@/features/reviews/schemas'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'

export async function generateMetadata({ params }: PageProps<'/products/[slug]'>): Promise<Metadata> {
  const product = await getProduct((await params).slug)
  if (!product) return { title: 'Not found' }

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image_url ? [{ url: product.image_url, width: 1600, height: 1067 }] : undefined,
    },
  }
}

// Silences instant-navigation validation; it does not make the route answer 404 (D17).
export const instant = false

export default async function ProductPage({ params, searchParams }: PageProps<'/products/[slug]'>) {
  const product = await getProduct((await params).slug)
  if (!product) notFound()

  // The same schema the shop parses, because these are the shop's own params riding along.
  const search = shopSearchSchema.parse(await searchParams)
  const reviewSort = reviewSortSchema.parse((await searchParams).reviews)
  const related = await getRelated(product, 12)
  const soldOut = product.stock_quantity === 0
  const low = !soldOut && product.stock_quantity <= 3

  return (
    <Container className="flex flex-col gap-16 py-10">
      <div className="flex flex-col gap-6">
        <Breadcrumbs search={search} category={product.category} name={product.name} />
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {product.image_url && (
            <ProductImage src={product.image_url} alt={product.name} objectPosition={focalPosition(product.slug)} />
          )}

          <div className="flex flex-1 flex-col items-start gap-6 lg:py-8">
            <div className="flex flex-col gap-3">
              <Link
                href={`/shop?category=${product.category}`}
                className="text-sm text-olive-600 underline underline-offset-4 dark:text-olive-400"
              >
                {categoryLabels[product.category]}
              </Link>
              <Heading className="text-4xl/10 sm:text-5xl/12">{product.name}</Heading>
            </div>

            <Price product={product} size="lg" />

            <Suspense fallback={null}>
              <RatingSummary productId={product.id} />
            </Suspense>

            <Text>
              <p>{product.description}</p>
            </Text>

            {(product.dimensions || product.materials) && (
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                {product.dimensions && (
                  <>
                    <dt className="text-olive-600 dark:text-olive-400">Dimensions</dt>
                    <dd className="text-olive-950 dark:text-white">{product.dimensions}</dd>
                  </>
                )}
                {product.materials && (
                  <>
                    <dt className="text-olive-600 dark:text-olive-400">Materials</dt>
                    <dd className="text-olive-950 dark:text-white">{product.materials}</dd>
                  </>
                )}
              </dl>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <AddToCart productId={product.id} name={product.name} stock={product.stock_quantity} />
                <Suspense fallback={null}>
                  <SaveControl productId={product.id} name={product.name} />
                </Suspense>
              </div>
              <p className="text-sm text-olive-600 dark:text-olive-400">
                {soldOut
                  ? 'Back when the next batch comes out of the kiln.'
                  : low
                    ? `Only ${product.stock_quantity} left`
                    : 'In stock, ships in 3–5 days'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <section id="reviews" className="flex min-w-0 flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Subheading>Reviews</Subheading>
            <SortSelect
              label="Sort reviews"
              scroll={false}
              value={reviewSort}
              options={reviewSorts.map((sort) => ({
                value: sort,
                label: reviewSortLabels[sort],
                href: reviewsHref(product.slug, fromShop(search), sort),
              }))}
            />
          </div>
          <Suspense fallback={<p className="text-sm text-olive-600 dark:text-olive-400">Loading reviews…</p>}>
            <Reviews productId={product.id} slug={product.slug} sort={reviewSort} />
          </Suspense>
        </section>

        <div className="lg:pt-2">
          <Accordion type="single" collapsible className="w-full">
            {Object.keys(product.specs).length > 0 && (
              <AccordionItem value="specs">
                <AccordionTrigger>Product information</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-6">
                    {Object.entries(product.specs).map(([group, rows]) => (
                      <div key={group} className="flex flex-col gap-2">
                        <h4 className="font-medium text-olive-950 dark:text-white">{group}</h4>
                        <dl className="grid grid-cols-[minmax(0,10rem)_1fr] gap-x-6">
                          {Object.entries(rows).map(([label, value]) => (
                            <Fragment key={label}>
                              <dt className="border-t border-olive-200 py-2 text-olive-600 dark:border-olive-800 dark:text-olive-400">
                                {label}
                              </dt>
                              <dd className="border-t border-olive-200 py-2 dark:border-olive-800">{value}</dd>
                            </Fragment>
                          ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="care">
              <AccordionTrigger>Care and repair</AccordionTrigger>
              <AccordionContent>
                Dishwasher safe, though handwashing keeps the glaze brighter for longer. Timber is oiled rather than
                lacquered, so a scratch can be sanded back and re-oiled. We keep spares for everything we have sold.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping">
              <AccordionTrigger>Shipping and returns</AccordionTrigger>
              <AccordionContent>
                Shipped in 3–5 working days, packed in straw board rather than plastic. Return anything unused within 30
                days and we will collect it.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="flex flex-col gap-8">
          <Subheading>
            More from{' '}
            <Link
              href={`/shop?category=${product.category}`}
              className="text-olive-500 no-underline transition-colors hover:underline hover:decoration-1 hover:underline-offset-[6px] dark:text-olive-400"
            >
              {categoryLabels[product.category].toLowerCase()}
            </Link>
          </Subheading>
          <ProductRail products={related} from={fromShop(search)} />
        </section>
      )}
    </Container>
  )
}

// Request-time, because it depends on who is reading; the cached product shell above is not.
async function Reviews({ productId, slug, sort }: { productId: number; slug: string; sort: ReviewSort }) {
  const session = await getSession()
  const [reviews, own] = await Promise.all([
    listReviews(productId, { sort, viewerId: session?.user.id }),
    session ? getOwnReview(session.user.id, productId) : null,
  ])

  return (
    <div className="flex flex-col gap-10">
      <ReviewList reviews={reviews} productId={productId} viewerId={session?.user.id} />
      <div className="flex flex-col gap-4 border-t border-olive-950/10 pt-8 dark:border-white/10">
        <h3 className="font-medium text-olive-950 dark:text-white">{own ? 'Your review' : 'Write a review'}</h3>
        <ReviewForm productId={productId} slug={slug} existing={own} signedIn={Boolean(session)} />
      </div>
    </div>
  )
}

/** Sits by the price, where a rating is actually used, rather than only far below. */
async function RatingSummary({ productId }: { productId: number }) {
  const { count, average } = await summariseReviews(productId)
  if (count === 0) return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <Stars rating={average} />
      <a href="#reviews" className="text-olive-600 underline underline-offset-4 dark:text-olive-400">
        {average.toFixed(1)} · {count} review{count === 1 ? '' : 's'}
      </a>
    </div>
  )
}

/** Request-time, so the cached product shell above is untouched by who is reading. */
async function SaveControl({ productId, name }: { productId: number; name: string }) {
  const session = await getSession()
  const favorited = session ? (await listFavoriteIds(session.user.id)).includes(productId) : false
  return <FavoriteButton productId={productId} name={name} favorited={favorited} />
}
