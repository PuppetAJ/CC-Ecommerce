import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Nothing is cached unless a function opts in with "use cache".
  cacheComponents: true,

  // /faq was a page of its own before the help page absorbed it.
  async redirects() {
    return [{ source: '/faq', destination: '/help', permanent: true }]
  },
}

export default nextConfig
