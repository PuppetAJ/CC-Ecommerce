import { formatPrice } from '@/lib/format'

/** Working days only, matching the "3–5 working days" the product pages promise. */
function arrivalWindow(from = new Date()) {
  const add = (days: number) => {
    const date = new Date(from)
    let left = days
    while (left > 0) {
      date.setDate(date.getDate() + 1)
      if (date.getDay() !== 0 && date.getDay() !== 6) left--
    }
    return date
  }
  const format = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
  return `${format(add(3))} – ${format(add(5))}`
}

export function OrderBreakdown({ subtotal }: { subtotal: number }) {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex justify-between text-olive-600 dark:text-olive-400">
        <span>Subtotal</span>
        <span className="text-olive-950 tabular-nums dark:text-white">{formatPrice(subtotal)}</span>
      </div>
      <div className="flex justify-between text-olive-600 dark:text-olive-400">
        <span>Shipping</span>
        <span className="text-olive-950 dark:text-white">Free</span>
      </div>
      <div className="flex justify-between border-t border-olive-950/10 pt-3 text-base font-medium text-olive-950 dark:border-white/10 dark:text-white">
        <span>Total</span>
        <span className="tabular-nums">{formatPrice(subtotal)}</span>
      </div>
      <p className="text-xs text-olive-600 dark:text-olive-400">
        Arrives {arrivalWindow()}, packed in straw board rather than plastic.
      </p>
    </div>
  )
}

export function Reassurances() {
  const items = [
    ['Payment is handled by Stripe', 'Your card details never touch our servers.'],
    ['Free returns within 30 days', 'Send anything unused back and we collect it.'],
  ]

  return (
    <ul className="flex flex-col gap-3 border-t border-olive-950/10 pt-5 dark:border-white/10">
      {items.map(([title, detail]) => (
        <li key={title} className="text-xs/5">
          <span className="font-medium text-olive-950 dark:text-white">{title}</span>
          <span className="text-olive-600 dark:text-olive-400"> — {detail}</span>
        </li>
      ))}
    </ul>
  )
}
