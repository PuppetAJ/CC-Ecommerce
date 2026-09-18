import { PlaceholderPage } from '@/components/placeholder-page'

export default async function ProductPage({ params }: PageProps<'/products/[slug]'>) {
  const { slug } = await params
  return <PlaceholderPage title={slug} phase="phase 3" />
}
