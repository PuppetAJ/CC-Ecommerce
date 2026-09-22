const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const shortDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
const longDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
const monthAndDay = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long' })
// The dashboard's days are UTC buckets out of Postgres, so reading them locally would shift the label.
const utcDay = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
const utcDayShort = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const count = new Intl.NumberFormat('en-US')

/** Money is stored as integer cents everywhere, so display is the only place it divides. */
export function formatPrice(cents: number): string {
  return currency.format(cents / 100)
}

/** Lists and tables, where the date is beside other columns. */
export function formatDate(date: Date): string {
  return shortDate.format(date)
}

/** Sentences, where the month is read rather than scanned. */
export function formatDateLong(date: Date): string {
  return longDate.format(date)
}

export function formatCount(value: number): string {
  return count.format(value)
}

/** A date with no year, for something close enough that the year is obvious. */
export function formatMonthAndDay(date: Date): string {
  return monthAndDay.format(date)
}

export function formatDay(date: Date): string {
  return utcDay.format(date)
}

export function formatDayShort(date: Date): string {
  return utcDayShort.format(date)
}
