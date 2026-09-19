import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { hasRole } from '@/lib/auth/options'
import { getSession } from '@/lib/auth/session'
import { AccountDropdown } from './account-dropdown'

/**
 * Async and request-time, which is why the header wraps it in Suspense: the rest
 * of the chrome stays cacheable and only this slot waits for the session.
 */
export async function AccountMenu() {
  const session = await getSession()

  if (!session) {
    return (
      <>
        <PlainButtonLink href="/login" className="max-sm:hidden">
          Log in
        </PlainButtonLink>
        <ButtonLink href="/register">Sign up</ButtonLink>
      </>
    )
  }

  return (
    <AccountDropdown name={session.user.name} email={session.user.email} isAdmin={hasRole(session.user, 'admin')} />
  )
}

export function AccountMenuFallback() {
  return <div className="h-9 w-24 animate-pulse rounded-full bg-olive-950/5 dark:bg-white/5" aria-hidden />
}
