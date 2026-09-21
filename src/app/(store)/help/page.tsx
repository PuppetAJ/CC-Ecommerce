import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Container } from '@/components/elements/container'
import { Eyebrow } from '@/components/elements/eyebrow'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { FaqAccordion } from '@/components/sections/faq-accordion'
import { HeroSimpleCentered } from '@/components/sections/hero-simple-centered'
import { ContactForm } from '@/features/help/components/contact-form'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Help',
  description: 'Shipping, returns, looking after what you bought, and how to reach the studio.',
}

const shipping = [
  {
    question: 'How long does delivery take?',
    answer: 'Ceramics leave within three working days. Furniture is made to order and takes four to six weeks.',
  },
  {
    question: 'What does shipping cost?',
    answer: 'Nothing. It is built into the price, which we would rather do than surprise you at the last step.',
  },
  {
    question: 'How is it packed?',
    answer:
      'Straw board and paper tape, no plastic and no polystyrene. Furniture travels in a blanket and a crate that can be flattened for recycling.',
  },
  {
    question: 'Do you ship outside the country?',
    answer:
      'For ceramics, yes. Furniture we will quote for, because a dining table crossing a border costs more to move than it does to make.',
  },
  {
    question: 'Can I track it?',
    answer:
      'Every order gets a number the moment it is paid for, and you can see its state under your account at any time.',
  },
]

const returns = [
  {
    question: 'Can I return something?',
    answer: 'Thirty days, unused, in its original packing. Made to order furniture is the exception.',
  },
  {
    question: 'It arrived broken. Now what?',
    answer:
      'Send a photograph and we will remake it or refund it, whichever you would rather. You do not need to send the pieces back.',
  },
  {
    question: 'Why can I not return made to order furniture?',
    answer:
      'Because it was cut for you and there is nobody else waiting for that exact table. We will always talk through a problem with one.',
  },
  {
    question: 'When does the refund arrive?',
    answer: 'As soon as the piece is back with us, on the card that paid for it, usually within a week.',
  },
]

const care = [
  {
    question: 'Is the glaze food safe?',
    answer: 'Every glaze we use is food safe and dishwasher safe. None of them like being left to soak.',
  },
  {
    question: 'Will the stoneware mark?',
    answer:
      'Tea and turmeric will stain an unglazed foot if you let them sit. A paste of bicarbonate of soda takes it straight back off.',
  },
  {
    question: 'How often does the timber need oiling?',
    answer:
      'Once a year for a table, less for a shelf. A rag, a little oil, and twenty minutes. We will send you the same oil we use if you ask.',
  },
  {
    question: 'Do you repair pieces?',
    answer: 'We do, for anything we made. Send a photograph and we will tell you honestly whether it is worth it.',
  },
  {
    question: 'Is this a real shop?',
    answer:
      'No. Wicken is a portfolio project. Checkout runs in Stripe test mode, no card is ever charged and no order is ever fulfilled.',
  },
]

export default function HelpPage() {
  return (
    <>
      <HeroSimpleCentered
        eyebrow="Help"
        headline="Ask us anything."
        subheadline={
          <p>
            Shipping, returns, and how to look after what you bought. If the answer is not below, the studio reads its
            email every morning.
          </p>
        }
      />

      <FaqAccordion id="shipping" headline="Shipping" items={shipping} />
      <FaqAccordion id="returns" headline="Returns" items={returns} />
      <FaqAccordion id="care" headline="Care and repair" items={care} />

      <section id="contact" className="scroll-mt-24 py-16">
        <Container className="grid grid-cols-1 gap-x-2 gap-y-10 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Eyebrow>Contact</Eyebrow>
              <Subheading>Still stuck?</Subheading>
            </div>
            <Text className="flex flex-col gap-4 text-pretty">
              <p>
                Write to <span className="text-olive-950 dark:text-white">hello@wicken.example</span>, or use the form.
                Either reaches the same two people.
              </p>
              <p>
                The workshop is at Unit 4, Fold Yard, and is open to visitors on the first Saturday of the month between
                ten and four. No appointment, and the kettle is usually on.
              </p>
              <p className="text-sm">
                Both the address and the email are invented. Anything you send through the form is stored in this
                demo&rsquo;s database so the admin dashboard has something to show, and nothing is emailed anywhere.
              </p>
            </Text>
          </div>

          {/* The session only prefills the fields, so the form renders for everybody either way. */}
          <Suspense fallback={<ContactForm waiting />}>
            <PrefilledForm />
          </Suspense>
        </Container>
      </section>
    </>
  )
}

async function PrefilledForm() {
  const session = await getSession()
  return <ContactForm name={session?.user.name ?? ''} email={session?.user.email ?? ''} />
}
