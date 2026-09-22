import 'server-only'
import { headers } from 'next/headers'
import { consume } from './db/queries/rate-limit'

// Behind Railway's proxy the first x-forwarded-for entry is the client; spoofable, so this only slows brute force.
async function clientId(): Promise<string> {
  const requestHeaders = await headers()
  const forwarded = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || requestHeaders.get('x-real-ip') || 'unknown'
}

/** One wording wherever a limit is hit, so the site does not sound different page to page. */
export const throttled = 'Too many attempts. Wait a minute and try again.'

/** Attempts a minute per address. The default of five matches the auth options' customRules. */
export async function limitAttempts(action: string, max = 5): Promise<boolean> {
  const { allowed } = await consume(`action:${action}:${await clientId()}`, { window: 60, max })
  return allowed
}
