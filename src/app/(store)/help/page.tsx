import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { MessageCircleQuestionIcon, PackageIcon, TruckIcon, Undo2Icon, WrenchIcon } from 'lucide-react'
import { Container } from '@/components/elements/container'
import { Logo } from '@/components/elements/logo'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { FaqAccordion } from '@/components/sections/faq-accordion'
import { ContactForm } from '@/features/help/components/contact-form'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Help',
  description: 'Shipping, returns, looking after what you bought, and how to reach the studio.',
}

const shipping = [
  {
    question: 'How long does delivery take?',
    answer: 'Ceramics ship within three business days. Furniture is made to order and takes four to six weeks.',
  },
  {
    question: 'What does shipping cost?',
    answer: "Nothing. It's built into the price. We'd rather do that than surprise you at checkout.",
  },
  {
    question: 'How is it packed?',
    answer:
      'Molded paper and paper tape, no plastic and no foam. Furniture travels in a blanket inside a crate that flattens for recycling.',
  },
  {
    question: 'Do you ship outside the US?',
    answer:
      "Ceramics, yes. Furniture we'll quote for, since moving a dining table across a border costs more than making it did.",
  },
]

const returns = [
  {
    question: 'Can I return something?',
    answer: 'Thirty days, unused, in its original packing. Made-to-order furniture is the exception.',
  },
  {
    question: 'It arrived broken. Now what?',
    answer:
      "Send us a photo and we'll remake it or refund it, whichever you prefer. You don't need to send the pieces back.",
  },
  {
    question: "Why can't I return made-to-order furniture?",
    answer:
      "Because it was cut for you, and nobody else is waiting for that exact table. If there's a problem with one, we'll always work it out.",
  },
  {
    question: 'When does the refund arrive?',
    answer: 'As soon as the piece is back with us, to the card you paid with, usually within a week.',
  },
]

const care = [
  {
    question: 'Is the glaze food safe?',
    answer: 'Every glaze we use is food safe and dishwasher safe. None of them like being left to soak.',
  },
  {
    question: 'Will the stoneware stain?',
    answer:
      'Tea and turmeric will stain an unglazed foot if you let them sit. A paste of baking soda takes it right off.',
  },
  {
    question: 'How often does the wood need oiling?',
    answer:
      "About once a year for a table, less for a shelf. A rag, a little oil, and twenty minutes. Ask and we'll send you the oil we use.",
  },
  {
    question: 'Do you repair pieces?',
    answer:
      "Anything we made, yes. Send a photo and we'll tell you honestly whether it's worth it. For lighting and linen we'll put you in touch with the workshop that made it, or handle it ourselves if that's easier.",
  },
]

const orders = [
  {
    question: 'Can I track my order?',
    answer: "Every order gets a number the moment it's paid, and you can check its status under your account any time.",
  },
  {
    question: 'Can I order without an account?',
    answer:
      'You can fill a cart without one, but checkout needs an account so the order has somewhere to live afterward.',
  },
  {
    question: 'Can I change an order after placing it?',
    answer:
      'Until it ships, yes. Email us with the order number. Made-to-order furniture can change until we cut the wood, usually the following week.',
  },
  {
    question: 'Is this a real shop?',
    answer:
      'No. Wicken is a portfolio project. Checkout runs in Stripe test mode, no card is ever charged and no order is ever fulfilled.',
  },
]

export default function HelpPage() {
  const topics = [
    {
      id: 'shipping',
      title: 'Shipping',
      blurb: 'When it leaves, what it costs, and how it is packed.',
      items: shipping,
      icon: <TruckIcon className="size-5" />,
    },
    {
      id: 'returns',
      title: 'Returns',
      blurb: 'Sending something back, and what happens if it arrives broken.',
      items: returns,
      icon: <Undo2Icon className="size-5" />,
    },
    {
      id: 'care',
      title: 'Care and repair',
      blurb: 'Washing, oiling, and what we will mend for you.',
      items: care,
      icon: <WrenchIcon className="size-5" />,
    },
    {
      id: 'orders',
      title: 'Orders and account',
      blurb: 'Tracking, changing an order, and what this demo actually does.',
      items: orders,
      icon: <PackageIcon className="size-5" />,
    },
  ]

  return (
    <>
      <section className="pt-12 pb-8 sm:pt-16">
        <Container className="flex flex-col items-center gap-5 text-center">
          <Logo className="size-9 text-olive-950 dark:text-white" />
          <h1 className="font-display text-4xl/12 font-medium tracking-tight text-balance text-olive-950 sm:text-5xl/14 dark:text-white">
            Ask us anything.
          </h1>
          <Text className="max-w-xl text-pretty">
            <p>
              Shipping, returns, and how to look after what you bought. If the answer isn't below,{' '}
              <Link href="#contact" className="text-olive-950 underline underline-offset-4 dark:text-white">
                write to the studio
              </Link>{' '}
              and somebody will read it the same morning.
            </p>
          </Text>
        </Container>
      </section>

      {/* A card each, so the three groups are visible at a glance rather than found by scrolling. */}
      <section className="py-8">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                href={`#${topic.id}`}
                className="flex flex-col gap-3 rounded-xl border border-olive-950/10 p-6 transition-colors hover:border-olive-950/25 hover:bg-olive-950/2.5 dark:border-white/10 dark:hover:border-white/25 dark:hover:bg-white/5"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-olive-950/5 text-olive-700 dark:bg-white/10 dark:text-olive-300">
                  {topic.icon}
                </span>
                <h2 className="font-medium text-olive-950 dark:text-white">{topic.title}</h2>
                <p className="text-sm/6 text-olive-700 dark:text-olive-400">{topic.blurb}</p>
                <p className="mt-auto pt-2 text-sm text-olive-600 dark:text-olive-500">
                  {topic.items.length} questions
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {topics.map((topic) => (
        <FaqAccordion key={topic.id} id={topic.id} headline={topic.title} icon={topic.icon} items={topic.items} />
      ))}

      <section id="contact" className="scroll-mt-24 py-12">
        <Container>
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 sm:rounded-xl sm:border sm:border-olive-950/10 sm:p-10 dark:sm:border-white/10">
            <div className="flex flex-col items-center gap-3 text-center">
              <span className="flex size-10 items-center justify-center rounded-lg bg-olive-950/5 text-olive-700 dark:bg-white/10 dark:text-olive-300">
                <MessageCircleQuestionIcon className="size-5" />
              </span>
              <Subheading className="text-2xl/8 sm:text-2xl/8">Still stuck?</Subheading>
              <Text className="max-w-lg text-pretty">
                <p>
                  Write to <span className="text-olive-950 dark:text-white">hello@wicken.example</span> or use the form.
                  Either one reaches the same two people.
                </p>
              </Text>
            </div>

            {/* The session only prefills the fields, so the form renders for everybody either way. */}
            <Suspense fallback={<ContactForm waiting />}>
              <PrefilledForm />
            </Suspense>

            <div className="flex flex-col gap-3 border-t border-olive-950/10 pt-6 text-sm/6 text-olive-700 dark:border-white/10 dark:text-olive-400">
              <p>
                The workshop is the old foundry on Mill Street in Hudson, New York. We're open to visitors the first
                Saturday of every month, 10 to 4, no appointment needed, and the coffee's usually on. We take a handful
                of commissions a year; write with a sketch and a size.
              </p>
              <p className="text-olive-600 dark:text-olive-500">
                The address and email are invented. Anything you send through the form is stored in this demo&rsquo;s
                database so the admin dashboard has something to show. Nothing is emailed anywhere.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}

async function PrefilledForm() {
  const session = await getSession()
  return <ContactForm name={session?.user.name ?? ''} email={session?.user.email ?? ''} />
}
