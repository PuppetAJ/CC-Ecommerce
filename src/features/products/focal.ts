// A 4:5 tile keeps only 53% of a 3:2 photograph's width, so a product sitting off-centre
// gets clipped. These are the horizontal object-position values, picked by eye; anything
// not listed is centred. Percentages are of the overflow, so 0 is hard left, 100 hard right.
const focalX: Record<string, number> = {
  'candle-holder-trio': 85,
  'elm-side-table': 40,
  'ridge-breakfast-mug': 40,
}

export function focalPosition(slug: string): string {
  return `${focalX[slug] ?? 50}% 50%`
}
