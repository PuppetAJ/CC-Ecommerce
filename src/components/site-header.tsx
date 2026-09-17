import Link from 'next/link'
import { CartSheet } from '@/components/cart-sheet'
import { Container } from '@/components/elements/container'
import { ButtonLink, PlainButtonLink } from '@/components/elements/button'
import { MobileNav } from '@/components/mobile-nav'
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
          <CartSheet />
          {/* Phase 4 swaps these for an account menu once there is a session to read. */}
          <PlainButtonLink href="/login" className="max-sm:hidden">
            Log in
          </PlainButtonLink>
          <ButtonLink href="/register">
            Sign up
          </ButtonLink>
          <MobileNav />
        </div>
      </Container>
    </header>
  )
}
