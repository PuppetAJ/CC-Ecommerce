import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'
import { requireUser } from '@/lib/auth/session'
import { demoAccounts } from '@/lib/auth/demo'
import { DeleteForm, NameForm } from '@/features/account/components/settings-forms'

export const metadata = { title: 'Settings' }

export const instant = false

export default async function Page() {
  const user = await requireUser()
  const isDemo = user.email === demoAccounts.customer.email || user.email === demoAccounts.admin.email

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <Heading>Settings</Heading>
        <Text>
          <p>Your details, and the way out.</p>
        </Text>
      </div>

      {isDemo && (
        <p className="rounded-lg bg-olive-950/5 p-4 text-sm text-olive-700 dark:bg-white/5 dark:text-olive-300">
          This is a shared demo account, so it cannot be renamed or deleted. Register your own to try these.
        </p>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-medium text-olive-950 dark:text-white">Your details</h2>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
          <dt className="text-olive-600 dark:text-olive-400">Email</dt>
          <dd className="text-olive-950 dark:text-white">{user.email}</dd>
        </dl>
        <NameForm name={user.name} readOnly={isDemo} />
      </section>

      <section className="flex flex-col gap-4 border-t border-olive-950/10 pt-10 dark:border-white/10">
        <h2 className="font-display text-xl font-medium text-olive-950 dark:text-white">Delete your account</h2>
        <Text className="max-w-xl">
          <p>
            This removes your account, your cart, your favorites, your reviews and your order history. It cannot be
            undone.
          </p>
        </Text>
        <DeleteForm email={user.email} readOnly={isDemo} />
      </section>
    </div>
  )
}
