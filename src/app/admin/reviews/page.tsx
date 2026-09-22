import Link from 'next/link'
import { Suspense } from 'react'
import { Cell, IndexTable, IndexTableSkeleton, Row } from '@/features/admin/components/index-table'
import { Pagination } from '@/features/admin/components/pagination'
import { ReviewRemover } from '@/features/admin/components/review-remover'
import { SearchFilters } from '@/features/admin/components/search-filters'
import { adminListSearch, pageHref } from '@/features/admin/schemas'
import { Stars } from '@/features/reviews/components/stars'
import { requireAdmin } from '@/lib/auth/session'
import { listAllReviews, perPage } from '@/lib/db/queries/admin'
import { formatDate } from '@/lib/format'
import { AdminHeading } from '@/features/admin/components/admin-heading'

export const metadata = { title: 'Reviews · Admin' }

export const instant = false

const search = adminListSearch

export default async function Page({ searchParams }: PageProps<'/admin/reviews'>) {
  await requireAdmin()
  const filters = search.parse(await searchParams)

  return (
    <div className="flex flex-col gap-6">
      <AdminHeading>Reviews</AdminHeading>
      <SearchFilters action="/admin/reviews" placeholder="Words, author or product" defaults={{ q: filters.q }} />
      <Suspense key={JSON.stringify(filters)} fallback={<IndexTableSkeleton />}>
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
          <Row key={`${review.user_id}-${review.product_id}`}>
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
              {formatDate(review.created_at)}
            </Cell>
            <Cell align="right">
              <ReviewRemover userId={review.user_id} productId={review.product_id} author={review.author} />
            </Cell>
          </Row>
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
