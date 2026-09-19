import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { ProductGrid } from '@/features/products/components/product-grid'
import { ProductImage } from '@/features/products/components/product-image'
import { getProduct, getRelated } from '@/features/products/data'
import { focalPosition } from '@/features/products/focal'
import { categoryLabels } from '@/features/products/schemas'
import { formatPrice } from '@/lib/format'
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
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image_url ? [{ url: product.image_url, width: 1600, height: 1067 }] : undefined,
    },
  }
}

// Silences instant-navigation validation for the uncached lookup. It does not make the
// route answer 404: with Cache Components the shell is flushed as 200 before notFound()
// runs, and Next adds robots noindex for that case. See docs/phases/04-auth.md.
export const instant = false

export default async function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  const product = await getProduct((await params).slug)
  if (!product) notFound()

  const related = await getRelated(product)
  const soldOut = product.stock_quantity === 0
  const low = !soldOut && product.stock_quantity <= 3

  return (
    <Container className="flex flex-col gap-24 py-16">
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

          <p className="text-2xl text-olive-950 dark:text-white">{formatPrice(product.price_cents)}</p>

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
            {/* Adding to the cart arrives in phase 5; the button states are here so the page is honest now. */}
            <Button size="lg" disabled className="w-56">
              {soldOut ? 'Sold out' : 'Add to cart'}
            </Button>
            <p className="text-sm text-olive-600 dark:text-olive-400">
              {soldOut
                ? 'Back when the next batch comes out of the kiln.'
                : low
                  ? `Only ${product.stock_quantity} left`
                  : 'In stock, ships in 3–5 days'}
            </p>
          </div>

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
          <ProductGrid products={related} />
        </section>
      )}
    </Container>
  )
}
