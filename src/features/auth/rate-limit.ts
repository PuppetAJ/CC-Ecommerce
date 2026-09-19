import 'server-only'
import { headers } from 'next/headers'
import { consume } from '@/lib/db/queries/rate-limit'

// Railway terminates TLS, so the socket address belongs to its proxy and the first
// entry of x-forwarded-for is the client. A determined attacker can rotate that, so
// this slows brute force down rather than being the only thing stopping it.
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
