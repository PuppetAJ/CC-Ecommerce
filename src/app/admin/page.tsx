import { PlaceholderPage } from '@/components/placeholder-page'
import { requireAdmin } from '@/lib/auth/session'

// Silences instant-navigation validation for the session read; it does not change
// the status code, which with Cache Components is settled before the check runs.
export const instant = false

export default async function Page() {
  await requireAdmin()
  return <PlaceholderPage title="Admin" phase="phase 8" />
}
