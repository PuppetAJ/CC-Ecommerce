import { categories } from '@/lib/db/types'
import { z } from 'zod'

export const categoryLabels: Record<(typeof categories)[number], string> = {
  tableware: 'Tableware',
  vases: 'Vases',
  lighting: 'Lighting',
  furniture: 'Furniture',
  textiles: 'Textiles',
  storage: 'Storage',
}

export const materials = [
  'stoneware',
  'porcelain',
  'earthenware',
  'stone',
  'oak',
  'ash',
  'elm',
  'pine',
  'walnut',
  'reclaimed-wood',
  'steel',
  'brass',
  'glass',
  'linen',
  'wax',
] as const

export const colors = [
  'white',
  'cream',
  'gray',
  'black',
  'blue',
  'red',
  'yellow',
  'gold',
  'terracotta',
  'natural',
  'mixed',
] as const

export const materialLabels: Record<(typeof materials)[number], string> = {
  stoneware: 'Stoneware',
  porcelain: 'Porcelain',
  earthenware: 'Earthenware',
  stone: 'Stone',
  oak: 'Oak',
  ash: 'Ash',
  elm: 'Elm',
  pine: 'Pine',
  walnut: 'Walnut',
  'reclaimed-wood': 'Reclaimed wood',
  steel: 'Steel',
  brass: 'Brass',
  glass: 'Glass',
  linen: 'Linen',
  wax: 'Wax',
}

export const colorLabels: Record<(typeof colors)[number], string> = {
  white: 'White',
  cream: 'Cream',
  gray: 'Gray',
  black: 'Black',
  blue: 'Blue',
  red: 'Red',
  yellow: 'Yellow',
  gold: 'Gold',
  terracotta: 'Terracotta',
  natural: 'Natural wood',
  mixed: 'Mixed',
}

// What each swatch shows. Approximate by nature: a glaze is not a hex code.
export const colorSwatches: Record<(typeof colors)[number], string> = {
  white: '#f4f3ef',
  cream: '#e8e0cf',
  gray: '#9a9a95',
  black: '#23231f',
  blue: '#2f4f7a',
  red: '#8c3027',
  yellow: '#d8b45a',
  gold: '#b08d46',
  terracotta: '#b0674a',
  natural: '#c29578',
  mixed: 'conic-gradient(#e8e0cf 0deg 120deg, #b0674a 120deg 240deg, #2f4f7a 240deg 360deg)',
}

// Bands, not a slider: most of a $18 to $1,280 catalog is under $200, so a slider mostly travels empty.
export const priceBands = ['under-50', '50-100', '100-200', 'over-200'] as const

export const priceBandLabels: Record<(typeof priceBands)[number], string> = {
  'under-50': 'Under $50',
  '50-100': '$50 to $100',
  '100-200': '$100 to $200',
  'over-200': 'Over $200',
}

/** Inclusive of the lower bound, exclusive of the upper, in cents. */
export const priceBandRanges: Record<(typeof priceBands)[number], [number, number | null]> = {
  'under-50': [0, 5000],
  '50-100': [5000, 10000],
  '100-200': [10000, 20000],
  'over-200': [20000, null],
}

export const sorts = ['newest', 'price-asc', 'price-desc', 'name'] as const

export const sortLabels: Record<(typeof sorts)[number], string> = {
  newest: 'Newest',
  'price-asc': 'Price: Low to high',
  'price-desc': 'Price: High to low',
  name: 'Name, A to Z',
}

// Shared with the input, so a query the box accepts is never one the schema drops.
export const searchMaxLength = 100

// Search params are user-controlled, so every field falls back rather than throwing.
export const shopSearchSchema = z.object({
  category: z.enum(categories).optional().catch(undefined),
  sort: z.enum(sorts).default('newest').catch('newest'),
  q: z.string().trim().min(1).max(searchMaxLength).optional().catch(undefined),
  // Repeated params (?material=oak&material=ash) arrive as an array, one as a string.
  material: z
    .union([z.enum(materials), z.array(z.enum(materials))])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional()
    .catch(undefined),
  color: z
    .union([z.enum(colors), z.array(z.enum(colors))])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional()
    .catch(undefined),
  price: z
    .union([z.enum(priceBands), z.array(z.enum(priceBands))])
    .transform((value) => (Array.isArray(value) ? value : [value]))
    .optional()
    .catch(undefined),
})

export type ShopSearch = z.infer<typeof shopSearchSchema>

/** Builds a /shop URL, dropping defaults so the common case stays a clean path. */
export function shopHref(search: Partial<ShopSearch>): string {
  const params = new URLSearchParams()
  if (search.category) params.set('category', search.category)
  if (search.sort && search.sort !== 'newest') params.set('sort', search.sort)
  if (search.q) params.set('q', search.q)
  for (const material of search.material ?? []) params.append('material', material)
  for (const color of search.color ?? []) params.append('color', color)
  for (const band of search.price ?? []) params.append('price', band)
  const query = params.toString()
  return query ? `/shop?${query}` : '/shop'
}

/** The shop's filters as a query string to hang on a product link, so it can offer a way back. */
export function fromShop(search: Partial<ShopSearch>): string {
  const href = shopHref(search)
  return href === '/shop' ? '' : `?${href.split('?')[1]}`
}
