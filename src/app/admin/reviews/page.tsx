import Link from 'next/link'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Cell, IndexTable } from '@/features/admin/components/index-table'
import { Pagination } from '@/features/admin/components/pagination'
import { ReviewRemover } from '@/features/admin/components/review-remover'
import { SearchFilters } from '@/features/admin/components/search-filters'
import { pageHref, pageNumber } from '@/features/admin/schemas'
import { Stars } from '@/features/reviews/components/stars'
import { requireAdmin } from '@/lib/auth/session'
import { listAllReviews, perPage } from '@/lib/db/queries/admin'
import { z } from 'zod'

export const metadata = { title: 'Reviews · Admin' }

export const instant = false

const search = z.object({
  q: z.string().trim().min(1).max(100).optional().catch(undefined),
  page: pageNumber,
})

export default async function Page({ searchParams }: PageProps<'/admin/reviews'>) {
  await requireAdmin()
  const filters = search.parse(await searchParams)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-medium text-olive-950 dark:text-white">Reviews</h1>
      <SearchFilters action="/admin/reviews" placeholder="Words, author or product" defaults={{ q: filters.q }} />
      <Suspense key={JSON.stringify(filters)} fallback={<Skeleton className="h-64 rounded-xl" />}>
        <Rows q={filters.q} page={filters.page} />
      </Suspense>
    </div>
  )
}

async function Rows({ q, page }: { q?: string; page: number }) {
  const { rows: reviews, total } = await listAllReviews(q, page)

  return (
    <>
      <IndexTable columns={['Review', 'Product', 'Rating', 'Left', '']} empty="No reviews match that.">
        {reviews.map((review) => (
          <tr
            key={`${review.user_id}-${review.product_id}`}
            className="hover:bg-olive-950/[0.03] dark:hover:bg-white/[0.03]"
          >
            <Cell className="max-w-md">
              <span className="block text-xs text-olive-600 dark:text-olive-400">{review.author}</span>
              <span className="line-clamp-2 text-olive-950 dark:text-white">{review.body}</span>
            </Cell>
            <Cell>
              <Link
                href={`/products/${review.product_slug}`}
                className="text-olive-700 hover:underline dark:text-olive-300"
              >
                {review.product_name}
              </Link>
            </Cell>
            <Cell>
              <Stars rating={review.rating} />
            </Cell>
            <Cell className="whitespace-nowrap text-olive-600 dark:text-olive-400">
              {review.created_at.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Cell>
            <Cell align="right">
              <ReviewRemover userId={review.user_id} productId={review.product_id} author={review.author} />
            </Cell>
          </tr>
        ))}
      </IndexTable>
      <Pagination
        page={page}
        total={total}
        perPage={perPage}
        href={(next) => pageHref('/admin/reviews', { q }, next)}
      />
    </>
  )
}
