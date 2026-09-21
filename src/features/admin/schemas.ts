import { z } from 'zod'

export const ranges = ['7', '30', '90'] as const
export type Range = (typeof ranges)[number]

export const rangeLabels: Record<Range, string> = {
  '7': 'Last 7 days',
  '30': 'Last 30 days',
  '90': 'Last 90 days',
}

// Search params are user-controlled, so the page number falls back rather than throwing.
export const pageNumber = z.coerce.number().int().min(1).max(10000).default(1).catch(1)

/** Keeps the filters and moves the page, so paging never silently widens the list. */
export function pageHref(path: string, filters: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) if (value) params.set(key, value)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${path}?${query}` : path
}

export const adminSearchSchema = z.object({
  range: z.enum(ranges).default('30').catch('30'),
})

/** The window, and the one before it of the same length, so every figure can be compared. */
export function windows(range: Range): { from: Date; to: Date; wasFrom: Date; wasTo: Date } {
  const days = Number(range)
  const to = new Date()
  to.setUTCHours(0, 0, 0, 0)
  to.setUTCDate(to.getUTCDate() + 1)

  const from = new Date(to)
  from.setUTCDate(from.getUTCDate() - days)
  const wasFrom = new Date(from)
  wasFrom.setUTCDate(wasFrom.getUTCDate() - days)

  return { from, to, wasFrom, wasTo: from }
}

export function adminHref(path: string, params: Record<string, string | undefined>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) if (value) search.set(key, value)
  const query = search.toString()
  return query ? `${path}?${query}` : path
}

export const productEdit = z.object({
  id: z.coerce.number().int().positive(),
  priceDollars: z.coerce.number().min(0).max(100000),
  // An empty field arrives as '', and z.coerce.number() turns that into 0, which stored a
  // sale at $0.00 and made the product free. Emptiness has to become null before coercion.
  salePriceDollars: z.preprocess(
    (value) => (value === '' || value === null || value === undefined ? null : value),
    z.coerce.number().min(0).max(100000).nullable(),
  ),
  stock: z.coerce.number().int().min(0).max(9999),
  featured: z.union([z.literal('on'), z.literal(null), z.undefined()]).transform(Boolean),
})

export const orderStatusEdit = z.object({
  id: z.coerce.number().int().positive(),
  status: z.enum(['pending', 'paid', 'cancelled']),
})

export const reviewTarget = z.object({
  userId: z.string().min(1).max(200),
  productId: z.coerce.number().int().positive(),
})
