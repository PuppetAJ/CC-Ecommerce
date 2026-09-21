'use server'

import { getSession } from '@/lib/auth/session'
import { saveMessage } from '@/lib/db/queries/messages'
import { isBot } from '@/lib/honeypot'
import { limitAttempts } from '@/lib/rate-limit'
import { message } from './schemas'

export type MessageState = { error?: string; sentAt?: number }

export async function sendMessage(_previous: MessageState, formData: FormData): Promise<MessageState> {
  // Answered as though it worked, because a bot told it failed simply tries again.
  if (isBot(formData)) return { sentAt: Date.now() }

  const parsed = message.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    body: formData.get('body'),
  })
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  if (!(await limitAttempts('message', 3))) return { error: 'That is several messages already. Try again shortly.' }

  const session = await getSession()
  await saveMessage(parsed.data.name, parsed.data.email, parsed.data.body, session?.user.id ?? null)
  return { sentAt: Date.now() }
}
