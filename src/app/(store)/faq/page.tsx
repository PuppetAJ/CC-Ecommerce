import type { Metadata } from 'next'
import { FaqAccordion } from '@/components/sections/faq-accordion'

export const metadata: Metadata = { title: 'FAQ' }

const items = [
  {
    question: 'How long does delivery take?',
    answer: 'Ceramics ship within three days. Furniture is made to order and takes four to six weeks.',
  },
  {
    question: 'Can I return something?',
    answer: 'Thirty days, unused, in its original packing. Made-to-order furniture is the exception.',
  },
  {
    question: 'Is the glaze food safe?',
    answer: 'Every glaze we use is food safe and dishwasher safe. None of them like being left to soak.',
  },
  {
    question: 'Do you repair pieces?',
    answer: 'We do, for anything we made. Send a photograph and we will tell you whether it is worth it.',
  },
  {
    question: 'Is this a real shop?',
    answer: 'No. Wicken is a portfolio project. Checkout runs in Stripe test mode and no order is ever fulfilled.',
  },
]

export default function FaqPage() {
  return (
    <FaqAccordion
      headline="Questions people ask"
      subheadline={<p>If yours is not here, the studio answers email within a day or two.</p>}
      items={items}
    />
  )
}
