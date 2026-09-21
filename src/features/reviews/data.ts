import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { listTestimonials } from '@/lib/db/queries/reviews'

export async function getTestimonials(limit = 3) {
  'use cache'
  cacheLife('hours')
  cacheTag('reviews')
  return listTestimonials(limit)
}
