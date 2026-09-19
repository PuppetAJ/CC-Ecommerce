'use client'

import { useActionState, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/elements/button'
import { addToCart, type CartState } from '../actions'
import { useCartOpen } from './cart-open'
import { QuantityStepper } from './quantity-stepper'

export function AddToCart({ productId, name, stock }: { productId: number; name: string; stock: number }) {
  const [state, action, pending] = useActionState<CartState, FormData>(addToCart, undefined)
  const [quantity, setQuantity] = useState(1)
  const { setOpen } = useCartOpen()

  useEffect(() => {
    if (state?.addedAt) setOpen(true)
    if (state?.error) toast.error(state.error)
  }, [state, setOpen])

  if (stock <= 0) {
    return (
      <Button size="lg" disabled className="w-56">
        Sold out
      </Button>
    )
  }

  return (
    // A plain form post, so the button still works with JavaScript switched off; the sheet
    // opening is the enhancement on top.
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={quantity} />
      <QuantityStepper quantity={quantity} max={stock} onChange={setQuantity} disabled={pending} label={name} />
      <Button type="submit" size="lg" disabled={pending} className="w-44">
        {pending ? 'Adding…' : 'Add to cart'}
      </Button>
    </form>
  )
}
