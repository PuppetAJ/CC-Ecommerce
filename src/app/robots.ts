import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Nothing here is secret, but none of it is worth indexing either.
      disallow: ['/admin', '/account', '/cart', '/checkout', '/api'],
    },
    sitemap: `${env.APP_URL}/sitemap.xml`,
  }
}
