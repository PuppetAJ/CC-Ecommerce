'use client'

import { useActionState } from 'react'
import { register, type AuthState } from '../actions'
import { Field } from '@/components/elements/field'
import { FormError } from '@/components/elements/form-error'
import { SubmitButton } from './submit-button'

export function RegisterForm({ next }: { next: string }) {
  const [state, action] = useActionState<AuthState, FormData>(register, undefined)

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Name" name="name" autoComplete="name" required maxLength={80} />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        minLength={10}
        hint="At least 10 characters."
      />
      {state?.error ? <FormError>{state.error}</FormError> : null}
      <SubmitButton pendingLabel="Creating your account…">Create account</SubmitButton>
    </form>
  )
}
