// A 4:5 tile keeps only 53% of a 3:2 photograph's width, so a product sitting off-centre
// gets clipped. These are the horizontal object-position values, picked by eye against the
// crop window drawn over each frame; anything not listed is centred. Percentages are of
// the overflow, so 0 is hard left and 100 hard right.
const focalX: Record<string, number> = {
  'column-table-lamp': 0,
  'elm-side-table': 15,
  'everyday-side-plate': 8,
  'globe-wall-light': 8,
  'hanging-pendant-shade': 90,
  'ridge-breakfast-mug': 40,
  'smoke-glaze-vase': 75,
  'spouted-pendant': 85,
  'stoneware-teapot': 30,
  'taper-candle-holders': 30,
}

export function focalPosition(slug: string): string {
  return `${focalX[slug] ?? 50}% 50%`
}
