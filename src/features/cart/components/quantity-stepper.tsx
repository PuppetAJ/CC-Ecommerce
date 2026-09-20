'use client'

import { MinusIcon, PlusIcon } from 'lucide-react'

export function QuantityStepper({
  quantity,
  max,
  onChange,
  disabled,
  label,
}: {
  quantity: number
  max: number
  onChange: (quantity: number) => void
  disabled?: boolean
  label: string
}) {
  const step =
    'inline-flex size-8 items-center justify-center rounded-full text-olive-700 hover:bg-olive-950/10 disabled:opacity-40 disabled:hover:bg-transparent dark:text-olive-400 dark:hover:bg-white/10'

  return (
    <div className="inline-flex items-center rounded-full border border-olive-950/10 dark:border-white/15">
      <button
        type="button"
        className={step}
        aria-label={`Remove one ${label}`}
        disabled={disabled || quantity <= 1}
        onClick={() => onChange(quantity - 1)}
      >
        <MinusIcon className="size-4" />
      </button>
      <span aria-live="polite" className="min-w-8 text-center text-sm tabular-nums">
        {quantity}
      </span>
      <button
        type="button"
        className={step}
        aria-label={`Add one ${label}`}
        disabled={disabled || quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  )
}
