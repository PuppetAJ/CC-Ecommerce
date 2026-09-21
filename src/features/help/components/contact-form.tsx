'use client'

import { useActionState } from 'react'
import { Button } from '@/components/elements/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { sendMessage, type MessageState } from '../actions'

export function ContactForm({
  name = '',
  email = '',
  // True only for the streaming placeholder, so nobody types into a copy that is about to be
  // replaced by the one carrying their name.
  waiting = false,
}: {
  name?: string
  email?: string
  waiting?: boolean
}) {
  const [state, action, pending] = useActionState<MessageState, FormData>(sendMessage, {})

  if (state.sentAt) {
    return (
      <p role="status" className="rounded-xl bg-olive-950/2.5 p-6 text-sm/7 dark:bg-white/5">
        Thank you, that is with us. The studio answers within a day or two.
        <br />
        <span className="text-olive-600 dark:text-olive-400">
          Wicken is a portfolio project, so nobody is really going to write back.
        </span>
      </p>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-4">
      {/* Off screen rather than hidden, because a script reads the styles too rarely to notice. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="website">Leave this empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset disabled={waiting} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Your name</Label>
            <Input id="name" name="name" required maxLength={80} defaultValue={name} className="h-10" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              maxLength={160}
              defaultValue={email}
              className="h-10"
            />
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="body">What can we help with?</Label>
          <textarea
            id="body"
            name="body"
            required
            rows={5}
            minLength={10}
            maxLength={2000}
            placeholder="A repair, a commission, or something that arrived not quite right."
            className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          />
        </div>
      </fieldset>

      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={pending} className="self-start">
        {pending ? 'Sending…' : 'Send it'}
      </Button>
    </form>
  )
}
