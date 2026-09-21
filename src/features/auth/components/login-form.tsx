'use client'

import { useActionState } from 'react'
import { signIn, type AuthState } from '../actions'
import { Field } from '@/components/elements/field'
import { FormError } from '@/components/elements/form-error'
import { SubmitButton } from './submit-button'

export function LoginForm({ next }: { next: string }) {
  const [state, action] = useActionState<AuthState, FormData>(signIn, undefined)

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      {state?.error ? <FormError>{state.error}</FormError> : null}
      <SubmitButton pendingLabel="Logging in…">Log in</SubmitButton>
    </form>
  )
}
