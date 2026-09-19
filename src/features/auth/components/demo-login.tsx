'use client'

import { useActionState } from 'react'
import { SoftButton } from '@/components/elements/button'
import { signInAsDemo, type AuthState } from '../actions'
import { FormError } from './field'

// Both buttons submit one form; the clicked button's name and value ride along in
// the FormData, which is how one action serves two roles without two forms.
export function DemoLogin() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signInAsDemo, undefined)

  return (
    <form action={action} className="grid gap-2">
      <div className="flex gap-2">
        <SoftButton type="submit" name="role" value="customer" size="lg" disabled={pending} className="flex-1">
          Demo shopper
        </SoftButton>
        <SoftButton type="submit" name="role" value="admin" size="lg" disabled={pending} className="flex-1">
          Demo admin
        </SoftButton>
      </div>
      {state?.error ? <FormError>{state.error}</FormError> : null}
    </form>
  )
}
