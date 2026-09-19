// A square tile keeps 67% of a 3:2 photograph's width, so most products sit fine centred.
// These are the horizontal object-position values for the ones that do not, picked by eye
// against the crop window drawn over each frame. Percentages are of the overflow, so 0 is
// hard left and 100 hard right. Recalibrated when the tiles went from 4:5 to square.
const focalX: Record<string, number> = {
  'ash-dining-table': 25,
  'ash-glaze-dinner-plate': 40,
  'cobalt-column-vase': 0,
  'column-table-lamp': 0,
  'deep-serving-bowl': 30,
  'elm-side-table': 25,
  'everyday-side-plate': 8,
  'globe-wall-light': 8,
  'hanging-pendant-shade': 90,
  'harvest-vase': 45,
  'smoke-glaze-vase': 75,
  'spouted-pendant': 70,
  'stoneware-teapot': 30,
  'taper-candle-holders': 30,
}

export function focalPosition(slug: string): string {
  return `${focalX[slug] ?? 50}% 50%`
}
