import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Rise } from '../motion'
import { Container } from '../elements/container'
import { Eyebrow } from '../elements/eyebrow'
import { Subheading } from '../elements/subheading'
import { Text } from '../elements/text'

export function CallToActionSimple({
  eyebrow,
  headline,
  subheadline,
  cta,
  tight = false,
  reveal = false,
  className,
  ...props
}: {
  eyebrow?: ReactNode
  headline: ReactNode
  subheadline?: ReactNode
  cta?: ReactNode
  tight?: boolean
  reveal?: boolean
} & ComponentProps<'section'>) {
  return (
    <section className={clsx(tight ? 'py-10 sm:py-14' : 'py-16', className)} {...props}>
      <Container className="flex flex-col gap-10">
        <Body reveal={reveal}>
          <div className="flex max-w-4xl flex-col gap-2">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <Subheading>{headline}</Subheading>
          </div>
          {subheadline && <Text className="flex max-w-3xl flex-col gap-4 text-pretty">{subheadline}</Text>}
        </Body>
        {cta}
      </Container>
    </section>
  )
}

function Body({ reveal, children }: { reveal: boolean; children: ReactNode }) {
  const className = 'flex flex-col gap-6'
  if (!reveal) return <div className={className}>{children}</div>
  return <Rise className={className}>{children}</Rise>
}
