import type { ReactNode } from 'react'
import { Container } from '@/components/elements/container'
import { Subheading } from '@/components/elements/subheading'
import { Text } from '@/components/elements/text'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

// Replaces Oatmeal's faqs-two-column-accordion, which used @tailwindplus/elements.
export function FaqAccordion({
  headline,
  subheadline,
  items,
  id,
}: {
  headline: ReactNode
  subheadline?: ReactNode
  items: { question: string; answer: ReactNode }[]
  /** Set where the footer links straight to one group, so the heading clears the header. */
  id?: string
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16">
      <Container className="grid grid-cols-1 gap-x-2 gap-y-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <Subheading>{headline}</Subheading>
          {subheadline && <Text className="flex flex-col gap-4 text-pretty">{subheadline}</Text>}
        </div>
        <Accordion type="single" collapsible className="border-y border-olive-950/10 dark:border-white/10">
          {items.map((item) => (
            <AccordionItem key={item.question} value={item.question}>
              <AccordionTrigger className="text-base/7 text-olive-950 dark:text-white">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pr-12 text-sm/7 text-olive-700 dark:text-olive-400">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </section>
  )
}
