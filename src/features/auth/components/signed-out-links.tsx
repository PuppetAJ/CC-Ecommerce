'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'

// A client component only so it can read where the visitor is, and hand that to ?next=.
export function SignedOutLinks() {
  const pathname = usePathname()
  const params = useSearchParams().toString()
  const here = `${pathname}${params ? `?${params}` : ''}`
  const next = pathname === '/' ? '' : `?next=${encodeURIComponent(here)}`

  return (
    <>
      <PlainButtonLink href={`/login${next}`} className="max-sm:hidden">
        Log in
      </PlainButtonLink>
      <ButtonLink href={`/register${next}`}>Sign up</ButtonLink>
    </>
  )
}
