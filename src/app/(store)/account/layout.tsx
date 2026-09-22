import { Container } from '@/components/elements/container'
import { AccountNav } from '@/app/_components/account-nav'

// A sidebar beside the order list is also the only place favorites can be reached from.
export default function AccountLayout({ children }: LayoutProps<'/account'>) {
  return (
    <Container className="grid gap-10 py-16 lg:grid-cols-[14rem_1fr] lg:gap-16">
      <AccountNav />
      <div className="min-w-0">{children}</div>
    </Container>
  )
}
