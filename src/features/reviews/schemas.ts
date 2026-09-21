import type { ReviewSort } from '@/lib/db/queries/reviews'
import { withoutNulls } from '@/lib/db/text'
import { z } from 'zod'

export const review = z.object({
  productId: z.coerce.number().int().positive(),
  rating: z.coerce.number().int().min(1).max(5),
  body: z.string().transform(withoutNulls).pipe(z.string().trim().min(1).max(2000)),
})

export const reviewVote = z.object({
  productId: z.coerce.number().int().positive(),
  reviewUserId: z.string().min(1).max(200),
  helpful: z.boolean().nullable(),
})

// Declared here rather than imported from the query module, which is server-only.
export const reviewSorts = ['helpful', 'recent', 'highest', 'lowest'] as const satisfies readonly ReviewSort[]

export const reviewSortLabels: Record<ReviewSort, string> = {
  helpful: 'Most helpful',
  recent: 'Newest',
  highest: 'Highest rated',
  lowest: 'Lowest rated',
}

// Falls back rather than throwing, like every other user-controlled param.
export const reviewSortSchema = z.enum(reviewSorts).default('helpful').catch('helpful')

/** The reviews sort as a param on the product URL, keeping any shop params riding along. */
export function reviewsHref(slug: string, from: string, sort: ReviewSort): string {
  const params = new URLSearchParams(from.replace(/^\?/, ''))
  if (sort === 'helpful') params.delete('reviews')
  else params.set('reviews', sort)
  const query = params.toString()
  return `/products/${slug}${query ? `?${query}` : ''}#reviews`
}
