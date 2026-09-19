import { PlaceholderPage } from '@/components/placeholder-page'
import { requireUser } from '@/lib/auth/session'

export const instant = false

export default async function Page() {
  await requireUser()
  return <PlaceholderPage title="Your orders" phase="phase 6" />
}
