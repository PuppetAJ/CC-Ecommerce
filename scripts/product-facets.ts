/**
 * Filterable facets, derived by hand from each product's `materials` prose.
 *
 * Not regex-derived on purpose: "Ash top" is a timber and "wood ash glaze" is a glaze made
 * from ash, and no pattern tells those apart. Thirty-seven rows are quicker to read than a
 * parser is to trust.
 */
export type Facets = { materials: string[]; color: string | null }

export const productFacets: Record<string, Facets> = {
  // Furniture: the timber is the material and the finish leaves it its own color.
  'ash-dining-table': { materials: ['ash', 'steel'], color: 'natural' },
  'elm-side-table': { materials: ['elm'], color: 'natural' },
  'low-workshop-stool': { materials: ['pine', 'reclaimed-timber'], color: 'natural' },
  'oak-book-table': { materials: ['oak'], color: 'natural' },
  'oak-dining-chair': { materials: ['oak'], color: 'natural' },
  'oak-wall-shelf': { materials: ['oak'], color: 'natural' },
  'weathered-stool': { materials: ['reclaimed-timber'], color: 'natural' },

  // Lighting.
  'bedside-lamp': { materials: ['stoneware', 'linen'], color: 'cream' },
  'column-table-lamp': { materials: ['linen', 'steel'], color: 'cream' },
  'fluted-pendant': { materials: ['porcelain', 'brass'], color: 'white' },
  'globe-wall-light': { materials: ['brass', 'glass'], color: 'gold' },
  'hanging-pendant-shade': { materials: ['porcelain'], color: 'white' },
  'kiln-table-lamp': { materials: ['stoneware', 'glass'], color: 'white' },
  'spouted-pendant': { materials: ['stoneware'], color: 'cream' },
  'stone-candle-set': { materials: ['stone', 'wax'], color: 'grey' },
  'taper-candle-holders': { materials: ['porcelain'], color: 'white' },

  // Tableware.
  'ash-glaze-dinner-plate': { materials: ['stoneware'], color: 'cream' },
  'butter-dish': { materials: ['porcelain'], color: 'white' },
  'butter-glaze-plate': { materials: ['stoneware'], color: 'yellow' },
  'deep-serving-bowl': { materials: ['stoneware'], color: 'white' },
  'everyday-side-plate': { materials: ['stoneware'], color: 'cream' },
  'gilt-rim-plate': { materials: ['porcelain'], color: 'gold' },
  'ridge-breakfast-mug': { materials: ['stoneware'], color: 'cream' },
  'ridged-tumblers': { materials: ['stoneware'], color: 'mixed' },
  'salt-cellar': { materials: ['stoneware'], color: 'cream' },
  'stacking-bowl-pair': { materials: ['stoneware'], color: 'cream' },
  'stoneware-teapot': { materials: ['stoneware'], color: 'cream' },
  'studio-mug-set': { materials: ['stoneware'], color: 'cream' },
  'tall-pitcher': { materials: ['stoneware'], color: 'white' },
  'teapot-trio': { materials: ['stoneware'], color: 'mixed' },
  'tumbler-set': { materials: ['stoneware'], color: 'cream' },

  // Vases.
  'cobalt-column-vase': { materials: ['stoneware'], color: 'blue' },
  'harvest-vase': { materials: ['earthenware'], color: 'terracotta' },
  'oxblood-vase': { materials: ['porcelain'], color: 'red' },
  'smoke-glaze-vase': { materials: ['stoneware'], color: 'grey' },
  'tall-stem-vase': { materials: ['stoneware'], color: 'white' },
  'wide-mouth-vessel': { materials: ['porcelain'], color: 'white' },
  'washed-linen-napkins': { materials: ['linen'], color: 'grey' },
  'linen-bread-cloth': { materials: ['linen'], color: 'natural' },
  'studio-apron': { materials: ['linen', 'brass'], color: 'natural' },
  'heavy-linen-throw': { materials: ['linen'], color: 'natural' },
  'linen-table-runner': { materials: ['linen'], color: 'natural' },
  'lidded-keepsake-box': { materials: ['walnut'], color: 'natural' },
  'turned-serving-trays': { materials: ['oak'], color: 'natural' },
  'stoneware-storage-jars': { materials: ['stoneware'], color: 'grey' },
  'turned-walnut-bowl': { materials: ['walnut'], color: 'natural' },
  'carved-catch-all': { materials: ['walnut'], color: 'natural' },
}
