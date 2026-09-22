'use client'

import { useActionState } from 'react'
import { GoogleIcon } from '@/components/icons/google-icon'
import { SoftButton } from '@/components/elements/button'
import { signInWithGoogle, type AuthState } from '../actions'
import { FormError } from '@/components/elements/form-error'

export function GoogleButton({ next, label }: { next: string; label: string }) {
  const [state, action, pending] = useActionState<AuthState, FormData>(signInWithGoogle, undefined)

  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="next" value={next} />
      <SoftButton type="submit" size="lg" disabled={pending} className="w-full">
        <GoogleIcon className="size-4" />
        {pending ? 'Redirecting…' : label}
      </SoftButton>
      {state?.error ? <FormError>{state.error}</FormError> : null}
    </form>
  )
}
