'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const KEY = 'wicken.session'

/** Lives for as long as the tab does, then is forgotten. No cookie, nothing about a person. */
function sessionId(): string | null {
  try {
    const existing = sessionStorage.getItem(KEY)
    if (existing) return existing
    const made = crypto.randomUUID()
    sessionStorage.setItem(KEY, made)
    return made
  } catch {
    // Private windows and blocked storage both land here; the visit simply goes uncounted.
    return null
  }
}

export function track(name: string, productId?: number | null): void {
  const session = sessionId()
  if (!session) return

  const body = JSON.stringify({ name, session, path: location.pathname, productId: productId ?? null })
  // Survives the page being closed on the way to Stripe, which a plain fetch would not.
  if (navigator.sendBeacon?.('/api/events', new Blob([body], { type: 'application/json' }))) return
  fetch('/api/events', { method: 'POST', body, keepalive: true }).catch(() => {})
}

/**
 * Views are recorded here rather than on the server because a page render can be served from
 * the cache under Cache Components, and a render that never runs cannot count itself.
 */
export function TrackView() {
  const path = usePathname()
  useEffect(() => track('view'), [path])
  return null
}

/** Sits on a product page, alongside the view the layout already counted. */
export function TrackProduct({ productId }: { productId: number }) {
  useEffect(() => track('product_view', productId), [productId])
  return null
}

/** The webhook has no session to attribute a sale to, so the purchase is counted here. */
export function TrackPurchase({ orderId }: { orderId: number }) {
  useEffect(() => track('purchase'), [orderId])
  return null
}
