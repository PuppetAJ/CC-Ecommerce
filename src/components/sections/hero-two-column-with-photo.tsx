import { clsx } from 'clsx/lite'
import type { ComponentProps, ReactNode } from 'react'
import { Container } from '../elements/container'
import { Heading } from '../elements/heading'
import { Text } from '../elements/text'

export function HeroTwoColumnWithPhoto({
  eyebrow,
  headline,
  subheadline,
  cta,
  photo,
  wide = false,
  className,
  ...props
}: {
  eyebrow?: ReactNode
  headline: ReactNode
  subheadline: ReactNode
  cta?: ReactNode
  photo?: ReactNode
  // Gives the photo 58% of the row and stops it stretching, so the whole frame shows uncropped.
  wide?: boolean
} & ComponentProps<'section'>) {
  return (
    <section className={clsx('py-16', className)} {...props}>
      <Container className={clsx('flex gap-16 max-xl:flex-col', wide && 'xl:items-center')}>
        <div
          className={clsx(
            'flex flex-col items-start justify-center gap-6',
            wide ? 'xl:flex-42' : 'flex-1',
          )}
        >
          {eyebrow}
          <Heading className="max-w-5xl">{headline}</Heading>
          <Text size="lg" className="flex max-w-3xl flex-col gap-4">
            {subheadline}
          </Text>
          {cta}
        </div>
        <div
          className={clsx(
            'flex overflow-hidden rounded-xl outline -outline-offset-1 outline-black/5 dark:outline-white/5',
            wide ? 'xl:flex-58 *:h-auto' : 'flex-1 *:object-cover',
          )}
        >
          {photo}
        </div>
      </Container>
    </section>
  )
}
