import type { MetadataRoute } from 'next'
import { listProducts } from '@/lib/db/queries/products'
import { categories } from '@/lib/db/types'
import { env } from '@/lib/env'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts({ sort: 'newest' })
  const at = (path: string) => `${env.APP_URL}${path}`

  return [
    { url: at('/'), changeFrequency: 'weekly', priority: 1 },
    { url: at('/shop'), changeFrequency: 'daily', priority: 0.9 },
    { url: at('/about'), changeFrequency: 'monthly', priority: 0.6 },
    { url: at('/help'), changeFrequency: 'monthly', priority: 0.6 },
    { url: at('/privacy'), changeFrequency: 'yearly', priority: 0.2 },
    ...categories.map((category) => ({
      url: at(`/shop?category=${category}`),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      url: at(`/products/${product.slug}`),
      lastModified: product.created_at,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ]
}
