'use client'

import { Button } from '@/components/ui/button'
import { Container } from '@/components/elements/container'
import { Heading } from '@/components/elements/heading'
import { Text } from '@/components/elements/text'
import { useEffect } from 'react'

export default function StoreError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container className="flex flex-col items-start gap-6 py-32">
      <Heading>Something came out of the kiln wrong.</Heading>
      <Text size="lg" className="max-w-xl">
        <p>This page failed to load. Trying again often works; if it does not, the studio is already looking at it.</p>
      </Text>
      <Button size="lg" onClick={reset}>
        Try again
      </Button>
      {error.digest && <p className="text-sm text-olive-600 dark:text-olive-400">Reference {error.digest}</p>}
    </Container>
  )
}
