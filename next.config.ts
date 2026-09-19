import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Nothing is cached unless a function opts in with "use cache"; see docs/NEXTJS.md §6.
  cacheComponents: true,
}

export default nextConfig
