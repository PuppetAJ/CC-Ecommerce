import Link from 'next/link'
import { ArrowLeftIcon } from 'lucide-react'
import { Container } from '@/components/elements/container'
import { AdminNav } from '@/features/admin/components/admin-nav'

// Chrome only: a layout serialises children into the payload, so each page checks the role itself.
export default function AdminLayout({ children }: LayoutProps<'/admin'>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-olive-950/10 dark:border-white/10">
        <Container className="flex h-14 items-center justify-between gap-6">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-lg font-medium text-olive-950 dark:text-white">Wicken</span>
            <span className="text-sm text-olive-600 dark:text-olive-400">Admin</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-olive-600 hover:text-olive-950 dark:text-olive-400 dark:hover:text-white"
          >
            <ArrowLeftIcon className="size-4" aria-hidden />
            Back to the store
          </Link>
        </Container>
      </header>

      <Container className="grid flex-1 gap-8 py-8 lg:grid-cols-[13rem_1fr] lg:gap-12">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </Container>
    </div>
  )
}
