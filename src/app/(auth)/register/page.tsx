import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { googleEnabled } from '@/lib/env'
import { safeNext } from '@/features/auth/schemas'
import { Divider } from '@/features/auth/components/divider'
import { GoogleButton } from '@/features/auth/components/google-button'
import { RegisterForm } from '@/features/auth/components/register-form'

export const metadata = { title: 'Create an account' }

export const instant = false

export default async function Page({ searchParams }: PageProps<'/register'>) {
  if (await getSession()) redirect('/')
  const next = safeNext((await searchParams).next)

  return (
    <div className="grid gap-6">
      <div className="grid gap-1.5">
        <h1 className="font-display text-3xl font-medium tracking-tight text-olive-950 dark:text-white">
          Create an account
        </h1>
        <p className="text-sm text-olive-600 dark:text-olive-400">
          Already have one?{' '}
          <Link href={`/login?next=${encodeURIComponent(next)}`} className="underline underline-offset-4">
            Log in
          </Link>
          .
        </p>
      </div>

      <RegisterForm next={next} />

      {googleEnabled ? (
        <>
          <Divider />
          <GoogleButton next={next} label="Continue with Google" />
        </>
      ) : null}
    </div>
  )
}
