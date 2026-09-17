'use client'

import { UserIcon } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account"
        className="inline-flex size-9 items-center justify-center rounded-full text-olive-700 hover:bg-olive-200 dark:text-olive-400 dark:hover:bg-olive-800"
      >
        <UserIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/login">Log in</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/register">Register</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/orders">Orders</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
