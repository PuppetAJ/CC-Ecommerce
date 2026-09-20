'use client'

import { useActionState } from 'react'
import { Button } from '@/components/elements/button'
import { track } from '@/components/analytics'
import { startCheckout, type CheckoutState } from '../actions'

export function PayButton({ total }: { total: string }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(() => startCheckout(), undefined)

  return (
    <form action={action} className="grid gap-3">
      <Button type="submit" size="lg" disabled={pending} onClick={() => track('checkout_started')} className="w-full">
        {pending ? 'Opening Stripe…' : `Pay ${total}`}
      </Button>
      {state?.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}
