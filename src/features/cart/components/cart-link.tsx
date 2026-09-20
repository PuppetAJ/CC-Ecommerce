'use client'

import Link from 'next/link'
import type { ComponentProps } from 'react'
import { useCartOpen } from './cart-open'

// The sheet does not close itself when a link inside it navigates.
export function CartLink({ href, ...props }: { href: string } & Omit<ComponentProps<'a'>, 'href'>) {
  const { setOpen } = useCartOpen()
  return <Link href={href} onClick={() => setOpen(false)} {...props} />
}
