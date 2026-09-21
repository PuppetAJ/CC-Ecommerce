import type { Metadata } from 'next'
import { DocumentCentered } from '@/components/sections/document-centered'

export const metadata: Metadata = { title: 'Privacy' }

export default function PrivacyPage() {
  return (
    <DocumentCentered headline="Privacy" subheadline={<p>Last updated September 2026.</p>}>
      <p>
        Wicken is a portfolio demonstration. It stores the email address and password hash of any account you create,
        the contents of your cart, and the orders you place against Stripe&rsquo;s test environment.
      </p>
      <p>
        Card details are never seen by this application. Payment is handled entirely on Stripe&rsquo;s own checkout
        pages, in test mode, where no real card is ever charged.
      </p>
      <p>
        It also counts how pages are used, in its own database, so the admin dashboard has real numbers rather than
        invented ones. That amounts to a page path, an event such as adding something to a cart, and a random id your
        browser tab invents for itself and forgets when you close it. No cookie is set for this, no address or device
        is recorded, and nothing is sent to anybody else. It measures visits, not people.
      </p>
      <p>
        The demo database is reset periodically. Do not put anything here you would mind losing, and do not reuse a
        password you use elsewhere.
      </p>
    </DocumentCentered>
  )
}
