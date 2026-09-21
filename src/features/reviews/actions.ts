'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth/session'
import { saveReview, voteOnReview } from '@/lib/db/queries/reviews'
import { review, reviewVote } from './schemas'

export type ReviewState = { error?: string; needsLogin?: boolean; savedAt?: number }

export async function submitReview(_previous: ReviewState, formData: FormData): Promise<ReviewState> {
  // Not requireUser: being bounced out of the page you were reading is worse than being asked.
  const session = await getSession()
  if (!session) return { needsLogin: true }

  const parsed = review.safeParse({
    productId: formData.get('productId'),
    rating: formData.get('rating'),
    body: formData.get('body'),
  })
  if (!parsed.success) return { error: 'Choose a rating and write a few words.' }

  await saveReview(session.user.id, parsed.data.productId, parsed.data.rating, parsed.data.body)
  // The product page is cached, and its reviews are not part of that cache key.
  revalidatePath(`/products/${formData.get('slug')}`)
  return { savedAt: Date.now() }
}

type VoteState = { error?: string; needsLogin?: boolean }

export async function voteOnHelpfulness(
  productId: number,
  reviewUserId: string,
  helpful: boolean | null,
): Promise<VoteState> {
  const session = await getSession()
  if (!session) return { needsLogin: true }

  const parsed = reviewVote.safeParse({ productId, reviewUserId, helpful })
  if (!parsed.success) return { error: 'That vote could not be counted.' }

  // The database rejects a vote on your own review, so this is the friendly message for it.
  if (parsed.data.reviewUserId === session.user.id) return { error: 'You cannot vote on your own review.' }

  await voteOnReview(session.user.id, parsed.data.reviewUserId, parsed.data.productId, parsed.data.helpful)
  return {}
}
