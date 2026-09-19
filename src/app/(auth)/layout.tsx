import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 lg:px-12">
        <Link href="/" className="font-display text-xl font-medium tracking-tight text-olive-950 dark:text-white">
          Wicken
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
      {/* The only portrait photograph in the set, so the panel needs no crop. At L*57 it reads
          as a lit block against the dark theme rather than receding, hence the dimming there. */}
      <div className="relative hidden bg-tile lg:block">
        <Image
          src="/images/editorial-bench.jpg"
          alt="A wooden bench and two stools in a plain concrete room"
          fill
          sizes="50vw"
          priority
          className="object-cover dark:brightness-[0.8]"
        />
      </div>
    </div>
  )
}
