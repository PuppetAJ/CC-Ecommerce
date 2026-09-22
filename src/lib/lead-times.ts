import { categories, type Category } from './db/types'

type LeadTime = { least: number; most: number; unit: 'business days' | 'weeks'; madeToOrder?: true }

/** What each kind of thing actually takes: the kiln decides for clay, and furniture is cut to order. */
const leadTimes: Record<Category, LeadTime> = {
  tableware: { least: 3, most: 5, unit: 'business days' },
  vases: { least: 3, most: 5, unit: 'business days' },
  textiles: { least: 3, most: 5, unit: 'business days' },
  storage: { least: 1, most: 2, unit: 'weeks' },
  lighting: { least: 2, most: 3, unit: 'weeks' },
  furniture: { least: 4, most: 6, unit: 'weeks', madeToOrder: true },
}

const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']

export function leadTimeFor(category: Category): LeadTime {
  return leadTimes[category]
}

/** The slowest thing in the basket, because the order ships together. */
export function slowestLeadTime(inCart: Category[]): LeadTime {
  const ordered = [...categories].sort((a, b) => days(leadTimes[b]) - days(leadTimes[a]))
  return leadTimes[ordered.find((category) => inCart.includes(category)) ?? 'tableware']
}

export function days({ most, unit }: LeadTime): number {
  return unit === 'weeks' ? most * 7 : most
}

/** "3–5 business days", for a line that is mostly numbers. */
export function leadTimeShort(lead: LeadTime): string {
  return `${lead.least}–${lead.most} ${lead.unit}`
}

/** "three to five business days", for a sentence. */
export function leadTimeWords(lead: LeadTime): string {
  return `${words[lead.least]} to ${words[lead.most]} ${lead.unit}`
}
