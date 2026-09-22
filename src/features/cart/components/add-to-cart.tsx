'use client'

import { useRouter } from 'next/navigation'
import { useActionState, useEffect, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/elements/button'
import { track } from '@/components/analytics'
import { addToCart, type CartState } from '../actions'
import { useCartOpen } from './cart-open'
import { QuantityStepper } from './quantity-stepper'

// Action state rides along in the client router cache, so returning to a product page
// replays the last result. Remembering which ones were acted on keeps the sheet from
// reopening on a visit the shopper did not add anything during.
const handled = new Set<string>()

export function AddToCart({
  productId,
  name,
  stock,
  // Rendered inside the form so the three controls share one wrapping row; it is a plain button,
  // which nests in a form perfectly well.
  save,
}: {
  productId: number
  name: string
  stock: number
  save?: ReactNode
}) {
  const [state, action, pending] = useActionState<CartState, FormData>(addToCart, undefined)
  const [quantity, setQuantity] = useState(1)
  const { setOpen } = useCartOpen()
  const router = useRouter()

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
      return
    }
    if (!state?.ok) return

    const token = `${productId}:${state.ok}`
    if (handled.has(token)) return
    handled.add(token)
    track('add_to_cart', productId)
    setOpen(true)
    // The badge and the sheet live in the layout, whose segment the page's own action
    // does not re-render, so this route is refreshed explicitly.
    router.refresh()
  }, [state, productId, setOpen, router])

  if (stock <= 0) {
    return (
      <div className="flex w-full items-center gap-3">
        <Button size="lg" disabled className="flex-1 sm:w-56 sm:flex-none">
          Sold out
        </Button>
        {save}
      </div>
    )
  }

  return (
    // The server action is the form's action, so the button still posts without JavaScript.
    <form action={action} className="flex w-full flex-wrap items-center gap-3">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={quantity} />
      <QuantityStepper quantity={quantity} max={stock} onChange={setQuantity} disabled={pending} label={name} />
      {/* Narrow, the count and the heart share the first line and the button takes the second;
          wide, the button moves between them. */}
      {save && <div className="ml-auto sm:order-3 sm:ml-0">{save}</div>}
      <Button type="submit" size="lg" disabled={pending} className="order-last w-full sm:order-2 sm:w-44 sm:flex-none">
        {pending ? 'Adding…' : 'Add to cart'}
      </Button>
    </form>
  )
}
