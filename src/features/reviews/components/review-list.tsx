import type { Review } from '@/lib/db/queries/reviews'
import { ShowMore } from './show-more'
import { ReviewVotes } from './review-votes'
import { Stars } from './stars'

export function ReviewList({
  reviews,
  productId,
  viewerId,
}: {
  reviews: Review[]
  productId: number
  viewerId?: string
}) {
  if (reviews.length === 0) {
    return <p className="text-sm text-olive-600 dark:text-olive-400">No reviews yet. Yours would be the first.</p>
  }

  return (
    <ShowMore initial={5} noun="reviews">
      {reviews.map((item) => (
        <li key={item.user_id} className="flex flex-col gap-2 border-t border-olive-950/10 pt-6 dark:border-white/10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Stars rating={item.rating} />
            <span className="text-sm font-medium text-olive-950 dark:text-white">{item.author}</span>
            <span className="text-sm text-olive-600 dark:text-olive-400">
              {item.created_at.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <p className="text-sm/6 text-olive-700 dark:text-olive-300">{item.body}</p>
          <div className="mt-1">
            {item.user_id === viewerId ? (
              <p className="text-xs text-olive-600 dark:text-olive-400">
                Your review · {item.helpful} found it helpful
              </p>
            ) : (
              <ReviewVotes
                productId={productId}
                reviewUserId={item.user_id}
                author={item.author}
                helpful={item.helpful}
                unhelpful={item.unhelpful}
                own={item.own_vote}
              />
            )}
          </div>
        </li>
      ))}
    </ShowMore>
  )
}
