import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { Cell, IndexTable, IndexTableSkeleton, Row } from '@/features/admin/components/index-table'
import { Pagination } from '@/features/admin/components/pagination'
import { SearchFilters } from '@/features/admin/components/search-filters'
import { adminListSearch, pageHref } from '@/features/admin/schemas'
import { categoryLabels } from '@/features/products/schemas'
import { requireAdmin } from '@/lib/auth/session'
import { listAdminProducts, perPage } from '@/lib/db/queries/admin'
import { categories } from '@/lib/db/types'
import { formatPrice } from '@/lib/format'
import { z } from 'zod'
import { AdminHeading } from '@/features/admin/components/admin-heading'

export const metadata = { title: 'Products · Admin' }

export const instant = false

const search = adminListSearch.extend({
  category: z.enum(categories).optional().catch(undefined),
  stock: z.enum(['low', 'out']).optional().catch(undefined),
})

export default async function Page({ searchParams }: PageProps<'/admin/products'>) {
  await requireAdmin()
  const filters = search.parse(await searchParams)

  return (
    <div className="flex flex-col gap-6">
      <AdminHeading>Products</AdminHeading>
      <SearchFilters
        action="/admin/products"
        placeholder="Name or slug"
        defaults={{ q: filters.q }}
        selects={[
          {
            name: 'category',
            label: 'Any category',
            value: filters.category,
            options: categories.map((category) => ({ value: category, label: categoryLabels[category] })),
          },
          {
            name: 'stock',
            label: 'Any stock',
            value: filters.stock,
            options: [
              { value: 'low', label: 'Running low' },
              { value: 'out', label: 'Sold out' },
            ],
          },
        ]}
      />
      <Suspense key={JSON.stringify(filters)} fallback={<IndexTableSkeleton />}>
        <Rows filters={filters} />
      </Suspense>
    </div>
  )
}

async function Rows({ filters }: { filters: z.infer<typeof search> }) {
  const { rows: products, total } = await listAdminProducts(filters)

  return (
    <>
      <IndexTable columns={['Product', 'Price', 'Stock', 'Featured', '']} empty="No products match that.">
        {products.map((product) => (
          <Row key={product.id}>
            <Cell>
              <div className="flex items-center gap-3">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-tile">
                  {product.image_url ? (
                    <Image src={product.image_url} alt="" fill sizes="40px" className="object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <span className="block text-xs text-olive-600 dark:text-olive-400">
                    {categoryLabels[product.category]}
                  </span>
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="font-medium text-olive-950 hover:underline dark:text-white"
                  >
                    {product.name}
                  </Link>
                </div>
              </div>
            </Cell>
            <Cell className="whitespace-nowrap tabular-nums">
              {product.sale_price_cents ? (
                <>
                  <span className="text-olive-950 dark:text-white">{formatPrice(product.sale_price_cents)}</span>{' '}
                  <span className="text-olive-600 line-through dark:text-olive-400">
                    {formatPrice(product.price_cents)}
                  </span>
                </>
              ) : (
                <span className="text-olive-950 dark:text-white">{formatPrice(product.price_cents)}</span>
              )}
            </Cell>
            <Cell
              className={`tabular-nums ${
                product.stock_quantity === 0
                  ? 'text-red-700 dark:text-red-400'
                  : product.stock_quantity <= 3
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-olive-600 dark:text-olive-400'
              }`}
            >
              {product.stock_quantity}
            </Cell>
            <Cell className="text-olive-600 dark:text-olive-400">{product.is_featured ? 'Yes' : 'No'}</Cell>
            <Cell align="right">
              <Link
                href={`/admin/products/${product.id}`}
                className="text-sm text-olive-950 underline underline-offset-4 dark:text-white"
              >
                Edit
              </Link>
            </Cell>
          </Row>
        ))}
      </IndexTable>
      <Pagination
        page={filters.page}
        total={total}
        perPage={perPage}
        href={(page) =>
          pageHref('/admin/products', { q: filters.q, category: filters.category, stock: filters.stock }, page)
        }
      />
    </>
  )
}
