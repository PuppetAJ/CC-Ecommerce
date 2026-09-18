'use client'

import { ShoppingBagIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function CartSheet() {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open cart"
        className="inline-flex size-9 items-center justify-center rounded-full text-olive-700 hover:bg-olive-200 dark:text-olive-400 dark:hover:bg-olive-800"
      >
        <ShoppingBagIcon className="size-5" />
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-xl font-medium">Your cart</SheetTitle>
          <SheetDescription>Your cart is empty.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 items-center justify-center px-4 text-sm text-olive-600 dark:text-olive-400">
          Nothing here yet.
        </div>
      </SheetContent>
    </Sheet>
  )
}
