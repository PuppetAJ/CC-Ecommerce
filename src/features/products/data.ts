import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { getProductBySlug, listFeaturedProducts, listProducts, listRelatedProducts } from '@/lib/db/queries/products'
import type { Product } from '@/lib/db/types'
import type { ShopSearch } from './schemas'

// Sits above src/lib/db, which must stay importable by plain Node for the tests and seed.

// Takes the parsed search params whole, so the URL's `q` cannot drift from the query's
// `search` the way it silently did once.
export async function getCatalogue({ category, sort, q }: ShopSearch): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return listProducts({ category, sort, search: q })
}

export async function getProduct(slug: string): Promise<Product | null> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return getProductBySlug(slug)
}

export async function getFeatured(limit = 4): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  return listFeaturedProducts(limit)
}

export async function getRelated(product: Product, limit = 4): Promise<Product[]> {
  'use cache'
  cacheLife('hours')
  cacheTag('products')
  // The query orders at random; caching freezes one roll per product, which is what we want.
  return listRelatedProducts(product, limit)
}
