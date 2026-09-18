import Link from 'next/link'

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-6 py-6 lg:px-10">
        <Link href="/" className="font-display text-xl font-medium tracking-tight text-olive-950 dark:text-white">
          Wicken
        </Link>
      </header>
      <main className="flex flex-1 items-center">{children}</main>
    </div>
  )
}
