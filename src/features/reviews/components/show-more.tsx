'use client'

import { Children, useState, type ReactNode } from 'react'

/**
 * Caps a long list and reveals the rest in place. The children arrive already rendered by the
 * server, so dates keep their server formatting and nothing is fetched to expand.
 *
 * At a few thousand reviews this would need real pagination; at a few dozen, sending them all
 * and hiding the tail is cheaper than a second round trip.
 */
export function ShowMore({ initial, noun, children }: { initial: number; noun: string; children: ReactNode }) {
  const items = Children.toArray(children)
  const [all, setAll] = useState(false)
  const hidden = items.length - initial

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-6">{all ? items : items.slice(0, initial)}</ul>
      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setAll(!all)}
          className="self-start text-sm text-olive-950 underline underline-offset-4 hover:text-olive-700 dark:text-white dark:hover:text-olive-300"
        >
          {all ? 'Show fewer' : `Show all ${items.length} ${noun}`}
        </button>
      )}
    </div>
  )
}
