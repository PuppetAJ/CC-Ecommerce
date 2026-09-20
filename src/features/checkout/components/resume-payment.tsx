'use client'

import { useActionState } from 'react'
import { Button } from '@/components/elements/button'
import { resumePayment, type CheckoutState } from '../actions'

/** An order left unpaid is otherwise a dead end: the cart it came from is already gone. */
export function ResumePayment({ orderId, size = 'md' }: { orderId: number; size?: 'md' | 'lg' }) {
  const [state, action, pending] = useActionState<CheckoutState, FormData>(() => resumePayment(orderId), undefined)

  return (
    <form action={action} className="flex flex-col gap-2">
      <Button type="submit" size={size} disabled={pending} className="self-start">
        {pending ? 'Opening Stripe…' : 'Complete payment'}
      </Button>
      {state?.error ? (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
    </form>
  )
}
