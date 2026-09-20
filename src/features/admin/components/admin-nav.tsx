'use client'

import { BoxIcon, ChartLineIcon, MessageSquareIcon, ReceiptIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Overview', icon: ChartLineIcon },
  { href: '/admin/orders', label: 'Orders', icon: ReceiptIcon },
  { href: '/admin/products', label: 'Products', icon: BoxIcon },
  { href: '/admin/customers', label: 'Customers', icon: UsersIcon },
  { href: '/admin/reviews', label: 'Reviews', icon: MessageSquareIcon },
]

export function AdminNav() {
  const path = usePathname()

  return (
    <nav aria-label="Admin" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
      {links.map(({ href, label, icon: Icon }) => {
        // Overview would otherwise light up on every page beneath it.
        const active = href === '/admin' ? path === href : path.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
              active
                ? 'bg-olive-950/10 font-medium text-olive-950 dark:bg-white/10 dark:text-white'
                : 'text-olive-600 hover:bg-olive-950/5 hover:text-olive-950 dark:text-olive-400 dark:hover:bg-white/5 dark:hover:text-white'
            }`}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
