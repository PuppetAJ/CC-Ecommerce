import 'server-only'
import { headers } from 'next/headers'
import { consume } from '@/lib/db/queries/rate-limit'

// Behind Railway's proxy the first x-forwarded-for entry is the client; spoofable, so this only slows brute force.
async function clientId(): Promise<string> {
  const requestHeaders = await headers()
  const forwarded = requestHeaders.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwarded || requestHeaders.get('x-real-ip') || 'unknown'
}

/** Five attempts a minute per address, matching the customRules in the auth options. */
export async function limitAttempts(action: string, max = 5): Promise<boolean> {
  const { allowed } = await consume(`action:${action}:${await clientId()}`, { window: 60, max })
  return allowed
}
