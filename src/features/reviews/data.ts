import 'server-only'
import { listTestimonials } from '@/lib/db/queries/reviews'

// Uncached deliberately; see the note on getFeatured in the products data module.
export async function getTestimonials(limit = 3) {
  return listTestimonials(limit)
}
