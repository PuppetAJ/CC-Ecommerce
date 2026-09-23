'use client'

import type { MouseEvent, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Row } from './table-row'

// The whole row opens the record; the real link inside still serves the keyboard, new tabs and readers.
export function LinkRow({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter()

  function open(event: MouseEvent<HTMLTableRowElement>) {
    const target = event.target as HTMLElement
    if (target.closest('a, button, input, select, label')) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    router.push(href)
  }

  return (
    <Row className="cursor-pointer" onClick={open}>
      {children}
    </Row>
  )
}
