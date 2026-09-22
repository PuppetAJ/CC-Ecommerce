'use client'

import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/elements/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deleteAccount, updateName, type AccountState } from '../actions'

export function NameForm({ name, readOnly }: { name: string; readOnly: boolean }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(updateName, undefined)

  useEffect(() => {
    if (state?.ok) toast.success('Name updated')
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={action} className="flex max-w-sm flex-col gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Display name</Label>
        <Input id="name" name="name" defaultValue={name} required maxLength={80} className="h-10" />
        <p className="text-xs text-olive-600 dark:text-olive-400">Shown on any review you write.</p>
      </div>
      <Button type="submit" size="lg" disabled={pending || readOnly} className="self-start">
        {pending ? 'Saving…' : 'Save'}
      </Button>
    </form>
  )
}

export function DeleteForm({ email, readOnly }: { email: string; readOnly: boolean }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(deleteAccount, undefined)
  const [confirm, setConfirm] = useState('')

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={action} className="flex max-w-sm flex-col gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="confirm">Type {email} to confirm</Label>
        <Input
          id="confirm"
          name="confirm"
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          autoComplete="off"
          placeholder={email}
          className="h-10"
        />
      </div>
      <Button
        type="submit"
        size="lg"
        disabled={pending || readOnly || confirm !== email}
        className="self-start bg-destructive text-white hover:bg-destructive/90 dark:bg-destructive dark:text-white dark:hover:bg-destructive/90"
      >
        {pending ? 'Deleting…' : 'Delete my account'}
      </Button>
    </form>
  )
}
