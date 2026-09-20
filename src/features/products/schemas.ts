import { categories } from '@/lib/db/types'
import { z } from 'zod'

export const categoryLabels: Record<(typeof categories)[number], string> = {
  tableware: 'Tableware',
  vases: 'Vases',
  lighting: 'Lighting',
  furniture: 'Furniture',
}

export const sorts = ['newest', 'price-asc', 'price-desc', 'name'] as const

export const sortLabels: Record<(typeof sorts)[number], string> = {
  newest: 'Newest',
  'price-asc': 'Price, low to high',
  'price-desc': 'Price, high to low',
  name: 'Name, A to Z',
}

// Search params are user-controlled, so every field falls back rather than throwing.
export const shopSearchSchema = z.object({
  category: z.enum(categories).optional().catch(undefined),
  sort: z.enum(sorts).default('newest').catch('newest'),
  q: z.string().trim().min(1).max(100).optional().catch(undefined),
})

export type ShopSearch = z.infer<typeof shopSearchSchema>

/** Builds a /shop URL, dropping defaults so the common case stays a clean path. */
export function shopHref(search: Partial<ShopSearch>): string {
  const params = new URLSearchParams()
  if (search.category) params.set('category', search.category)
  if (search.sort && search.sort !== 'newest') params.set('sort', search.sort)
  if (search.q) params.set('q', search.q)
  const query = params.toString()
  return query ? `/shop?${query}` : '/shop'
}

/** The shop's filters as a query string to hang on a product link, so it can offer a way back. */
export function fromShop(search: Partial<ShopSearch>): string {
  const href = shopHref(search)
  return href === '/shop' ? '' : `?${href.split('?')[1]}`
}
