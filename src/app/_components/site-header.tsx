import Link from 'next/link'
import { Suspense } from 'react'
import { CartSheet } from '@/app/_components/cart-sheet'
import { Container } from '@/components/elements/container'
import { MobileNav } from '@/app/_components/mobile-nav'
import { AccountMenu, AccountMenuFallback } from '@/features/auth/components/account-menu'
import { CartBadge } from '@/features/cart/components/cart-badge'
import { CartContents, CartContentsSkeleton } from '@/features/cart/components/cart-contents'
import { ThemeToggle } from '@/components/theme-toggle'
import { navLinks } from '@/lib/nav'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-olive-950/10 bg-olive-100/80 backdrop-blur dark:border-white/10 dark:bg-olive-950/80">
      <Container className="flex h-16 items-center gap-8">
        <Link href="/" className="font-display text-xl font-medium tracking-tight text-olive-950 dark:text-white">
          Wicken
        </Link>
        <nav className="hidden gap-6 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm/7 font-medium text-olive-700 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <CartSheet
            badge={
              <Suspense fallback={null}>
                <CartBadge />
              </Suspense>
            }
          >
            <Suspense fallback={<CartContentsSkeleton />}>
              <CartContents />
            </Suspense>
          </CartSheet>
          <Suspense fallback={<AccountMenuFallback />}>
            <AccountMenu />
          </Suspense>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
