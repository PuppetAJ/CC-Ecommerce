const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/** Money is stored as integer cents everywhere, so display is the only place it divides. */
export function formatPrice(cents: number): string {
  return currency.format(cents / 100)
}
