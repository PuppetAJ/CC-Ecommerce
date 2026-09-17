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
        The demo database is reset periodically. Do not put anything here you would mind losing, and do not reuse a
        password you use elsewhere.
      </p>
    </DocumentCentered>
  )
}
