'use server'

import { subscribe } from '@/lib/db/queries/subscribers'
import { limitAttempts } from '@/lib/rate-limit'
import { signup } from './schemas'

export type SignupState = { error?: string; joinedAt?: number; already?: boolean }

export async function joinNewsletter(_previous: SignupState, formData: FormData): Promise<SignupState> {
  // The honeypot, answered as though it worked: a bot told it failed simply tries again.
  if (formData.get('website')) return { joinedAt: Date.now() }

  const parsed = signup.safeParse({ email: formData.get('email'), source: formData.get('source') })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  if (!(await limitAttempts('subscribe'))) return { error: 'That is a few tries already. Give it a minute.' }

  const fresh = await subscribe(parsed.data.email, parsed.data.source)
  return { joinedAt: Date.now(), already: !fresh }
}
