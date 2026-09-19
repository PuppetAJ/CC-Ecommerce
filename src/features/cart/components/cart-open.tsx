'use client'

import { createContext, use, useState, type ReactNode } from 'react'

const CartOpenContext = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null)

// The sheet lives in the header and the button that should open it lives on the product
// page, so the open state sits above both in the store layout.
export function CartOpenProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <CartOpenContext value={{ open, setOpen }}>{children}</CartOpenContext>
}

export function useCartOpen() {
  const context = use(CartOpenContext)
  if (!context) throw new Error('useCartOpen must be used within CartOpenProvider')
  return context
}
