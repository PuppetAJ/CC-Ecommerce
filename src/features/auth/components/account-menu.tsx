import { hasRole } from '@/lib/auth/options'
import { getSession } from '@/lib/auth/session'
import { AccountDropdown } from './account-dropdown'
import { SignedOutLinks } from './signed-out-links'

/** Request-time, so the header wraps it in Suspense and the rest of the chrome stays cacheable. */
export async function AccountMenu() {
  const session = await getSession()

  if (!session) return <SignedOutLinks />

  return (
    <AccountDropdown name={session.user.name} email={session.user.email} isAdmin={hasRole(session.user, 'admin')} />
  )
}

export function AccountMenuFallback() {
  return <div className="h-9 w-24 animate-pulse rounded-full bg-olive-950/5 dark:bg-white/5" aria-hidden />
}
