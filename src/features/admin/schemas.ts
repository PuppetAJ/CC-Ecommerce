import { z } from 'zod'

export const ranges = ['7', '30', '90'] as const
export type Range = (typeof ranges)[number]

export const rangeLabels: Record<Range, string> = {
  '7': 'Last 7 days',
  '30': 'Last 30 days',
  '90': 'Last 90 days',
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
  salePriceDollars: z.union([z.coerce.number().min(0).max(100000), z.literal('')]).optional(),
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
