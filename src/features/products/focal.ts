// A 4:5 tile keeps only 53% of a 3:2 photograph's width, so a product sitting off-centre
// gets clipped. These are the horizontal object-position values, picked by eye against the
// crop window drawn over each frame; anything not listed is centred. Percentages are of
// the overflow, so 0 is hard left and 100 hard right.
const focalX: Record<string, number> = {
  'candle-holder-trio': 85,
  'elm-side-table': 15,
  // Frames the front plate, which is the product; the stack behind it is context.
  'everyday-side-plate': 8,
  'hanging-pendant-shade': 90,
  // 21% frames exactly two of the three vases, which is what "Paired" claims.
  'paired-bottle-vases': 21,
  'ridge-breakfast-mug': 40,
  'round-bud-vase': 18,
  'wall-sconce': 0,
}

export function focalPosition(slug: string): string {
  return `${focalX[slug] ?? 50}% 50%`
}
