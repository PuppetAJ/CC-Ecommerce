import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import {
  getProductBySlug,
  listCategoryCovers,
  listFacets,
  listFeaturedProducts,
  listProducts,
  listRelatedProducts,
} from '@/lib/db/queries/products'
import type { Product } from '@/lib/db/types'
import { priceBandRanges, type ShopSearch } from './schemas'

// Sits above src/lib/db, which must stay importable by plain Node for the tests and seed.

// Takes the parsed search params whole, so the URL's `q` cannot drift from the query's
// `search` the way it silently did once.
export async function getCatalogue({ category, sort, q, material, color, price }: ShopSearch): Promise<Product[]> {
  'use cache'
  cacheTag('products')
  // Free text is unbounded, so a long life would pin one entry per query ever typed.
  if (q) cacheLife('seconds')
  else cacheLife('hours')
  return listProducts({
    category,
    sort,
    search: q,
    materials: material,
    colors: color,
    priceRanges: price?.map((band) => priceBandRanges[band]),
  })
}

export async function getProduct(slug: string): Promise<Product | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return getProductBySlug(slug)
}

// Uncached, unlike its neighbours. A "use cache" result sitting in the landing page's
// prerendered shell leaves the router's segment prefetch of "/" open for good; these are three
// small indexed reads behind a Suspense boundary, so paying them per request costs nothing.
export async function getFeatured(limit = 4): Promise<Product[]> {
  return listFeaturedProducts(limit)
}

export async function getRelated(product: Product, limit = 4): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  // The query orders at random; caching freezes one roll per product, which is what we want.
  return listRelatedProducts(product, limit)
}

export async function getCategoryCovers() {
  return listCategoryCovers()
}

export async function getFacets() {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return listFacets()
}
