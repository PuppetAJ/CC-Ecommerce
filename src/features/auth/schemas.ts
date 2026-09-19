import { z } from 'zod'

export const credentials = z.object({
  email: z.email().max(254),
  password: z.string().min(10).max(128),
})

export const registration = credentials.extend({
  name: z.string().trim().min(1).max(80),
})

/**
 * A `?next=` value only ever returns a path on this site. Without the checks an
 * attacker could send /login?next=https://evil.example and have us redirect there
 * after a real sign-in, which is what makes the link convincing.
 */
export function safeNext(value: unknown, fallback = '/'): string {
  if (typeof value !== 'string') return fallback
  if (!value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}
