'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'

/** Filters against the URL rather than a cache, so every view stays an address and works without JS. */
export function useDebouncedQuery({
  applied,
  maxLength,
  build,
}: {
  /** What the page is already showing, so typing it again asks for nothing. */
  applied: string
  maxLength: number
  build: (wanted: string) => string
}) {
  const [value, setValue] = useState(applied)
  const [pending, start] = useTransition()
  const router = useRouter()

  // Kept fresh after each render so the timer, when it fires, builds from what is on screen now.
  const latest = useRef(build)
  useEffect(() => {
    latest.current = build
  })

  useEffect(() => {
    const wanted = value.trim().slice(0, maxLength)
    if (wanted === applied) return

    // A pause rather than a keystroke, or every letter is a round trip.
    const timer = setTimeout(() => start(() => router.replace(latest.current(wanted), { scroll: false })), 300)
    return () => clearTimeout(timer)
  }, [value, applied, maxLength, router])

  return { value, setValue, pending }
}
