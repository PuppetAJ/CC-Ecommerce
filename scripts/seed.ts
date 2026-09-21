import { pool } from '../src/lib/db/pool.ts'
import { seedDemoOrders } from './demo-orders.ts'
import { seedDemoReviews } from './demo-reviews.ts'
import { seedDemoUsers } from './demo-users.ts'
import type { Category } from '../src/lib/db/types.ts'
import { productFacets } from './product-facets.ts'
import { productSpecs } from './product-specs.ts'

type Seed = {
  slug: string
  name: string
  description: string
  category: Category
  price_cents: number
  stock_quantity: number
  dimensions: string
  materials: string
  is_featured?: boolean
}

const products: Seed[] = [
  {
    slug: 'ridge-breakfast-mug',
    name: 'Ridge Breakfast Mug',
    description:
      'Thrown with a deliberate ridge under the rim so it sits against the lip. Holds a generous three hundred millilitres, which is to say a proper cup rather than a polite one.',
    category: 'tableware',
    price_cents: 2800,
    stock_quantity: 40,
    dimensions: '9 cm tall, 8.5 cm across · 300 ml',
    materials: 'Stoneware, clear glaze',
    is_featured: true,
  },
  {
    slug: 'ash-glaze-dinner-plate',
    name: 'Ash Glaze Dinner Plate',
    description:
      'The glaze is mixed from wood ash out of our own kiln, which is why no two plates break the same way across the rim. Twenty-six centimetres.',
    category: 'tableware',
    price_cents: 3400,
    stock_quantity: 32,
    dimensions: '26 cm across, 2.5 cm deep',
    materials: 'Stoneware, wood ash glaze',
  },
  {
    slug: 'deep-serving-bowl',
    name: 'Deep Serving Bowl',
    description:
      'Wide enough for a salad for six, deep enough that dressing stays in it. The foot is left unglazed so it grips a wooden table.',
    category: 'tableware',
    price_cents: 5600,
    stock_quantity: 18,
    dimensions: '28 cm across, 11 cm deep · 2.4 l',
    materials: 'Stoneware, matt white glaze',
  },
  {
    slug: 'everyday-side-plate',
    name: 'Everyday Side Plate',
    description:
      'The plate we use most. Eighteen centimetres, stacks four deep in a standard cupboard, and survives being carried by the edge.',
    category: 'tableware',
    price_cents: 2200,
    stock_quantity: 60,
    dimensions: '21 cm across',
    materials: 'Stoneware, speckled glaze',
  },
  {
    slug: 'stacking-bowl-pair',
    name: 'Stacking Bowl Pair',
    description:
      'Two bowls thrown to nest inside one another, so they take one shelf rather than two. The smaller holds a breakfast portion, the larger a proper one.',
    category: 'tableware',
    price_cents: 4800,
    stock_quantity: 24,
    dimensions: '16 cm across, 7 cm deep · 500 ml each',
    materials: 'Stoneware, speckled glaze',
  },
  {
    slug: 'salt-cellar',
    name: 'Salt Cellar',
    description:
      'Open-topped, wide enough for a pinch between two fingers. Unglazed inside, which keeps flaked salt dry for longer than a lidded pot does.',
    category: 'tableware',
    price_cents: 1800,
    stock_quantity: 0,
    dimensions: '7 cm across, 5 cm tall',
    materials: 'Stoneware, unglazed foot',
  },
  {
    slug: 'tall-stem-vase',
    name: 'Tall Stem Vase',
    description:
      'Narrow at the neck so a single branch stands where you put it. Forty centimetres, and heavy enough in the base not to go over.',
    category: 'vases',
    price_cents: 6800,
    stock_quantity: 14,
    dimensions: '22 cm tall, 11 cm across the belly',
    materials: 'Stoneware, matt white glaze',
    is_featured: true,
  },
  {
    slug: 'wide-mouth-vessel',
    name: 'Wide Mouth Vessel',
    description:
      'Built for armfuls rather than arrangements. Works as a vase in summer and as a place for kindling the rest of the year.',
    category: 'vases',
    price_cents: 8900,
    stock_quantity: 9,
    dimensions: '18 cm across, 14 cm tall',
    materials: 'Porcelain, carved, unglazed',
  },
  {
    slug: 'kiln-table-lamp',
    name: 'Kiln Table Lamp',
    description:
      'A thrown stoneware base with a linen shade, wired for a standard screw fitting. The base is weighted so the cable can be tugged without consequence.',
    category: 'lighting',
    price_cents: 18500,
    stock_quantity: 8,
    dimensions: '42 cm tall, 26 cm shade',
    materials: 'Stoneware base, opal glass shade, E27',
    is_featured: true,
  },
  {
    slug: 'hanging-pendant-shade',
    name: 'Hanging Pendant Shade',
    description:
      'Glazed outside, left white inside so the light stays warm rather than tinted. Fits a standard pendant cord, which is not included.',
    category: 'lighting',
    price_cents: 11200,
    stock_quantity: 15,
    dimensions: '24 cm across, 18 cm deep',
    materials: 'Porcelain, braided flex, E27',
  },
  {
    slug: 'spouted-pendant',
    name: 'Spouted Pendant',
    description:
      'A thrown pendant with two cut spouts that throw light sideways as well as down. Hung on a braided flex, drop adjustable to a metre.',
    category: 'lighting',
    price_cents: 5400,
    stock_quantity: 22,
    dimensions: '26 cm tall, 12 cm across',
    materials: 'Stoneware, braided flex, E14',
  },
  {
    slug: 'column-table-lamp',
    name: 'Column Table Lamp',
    description:
      'A straight linen shade on a slim column, for a hallway table or the end of a worktop. Inline switch on the flex, standard bulb.',
    category: 'lighting',
    price_cents: 14900,
    stock_quantity: 6,
    dimensions: '46 cm tall, 14 cm shade',
    materials: 'Linen shade, steel column, E14',
  },
  {
    slug: 'oak-dining-chair',
    name: 'Oak Dining Chair',
    description:
      'Solid oak, mortise and tenon, no screws in the frame. Oil-finished so a scratch can be rubbed out rather than sent away.',
    category: 'furniture',
    price_cents: 42000,
    stock_quantity: 10,
    dimensions: '80 cm tall, 46 cm seat height',
    materials: 'Solid oak, oiled',
  },
  {
    slug: 'ash-dining-table',
    name: 'Ash Dining Table',
    description:
      'One hundred and eighty centimetres, seats six without anyone apologising. The top is a single glued panel, and the legs come off for a doorway.',
    category: 'furniture',
    price_cents: 128000,
    stock_quantity: 3,
    dimensions: '180 × 90 cm, 74 cm tall',
    materials: 'Ash top, brushed steel base',
    is_featured: true,
  },
  {
    slug: 'low-workshop-stool',
    name: 'Low Workshop Stool',
    description:
      'The stool we sit on at the wheel, made properly. Forty-five centimetres, three legs, so it never rocks on an uneven floor.',
    category: 'furniture',
    price_cents: 19500,
    stock_quantity: 16,
    dimensions: '45 cm tall, 40 × 28 cm seat',
    materials: 'Reclaimed pine, oiled',
  },
  {
    slug: 'elm-side-table',
    name: 'Elm Side Table',
    description:
      'Small enough to move with one hand and heavy enough to take a lamp. Elm, so the grain does the decoration.',
    category: 'furniture',
    price_cents: 36000,
    stock_quantity: 7,
    dimensions: '55 × 35 cm, 45 cm tall',
    materials: 'Solid elm, oiled',
  },
  {
    slug: 'harvest-vase',
    name: 'Harvest Vase',
    description:
      'A wide-bellied vase in a warm unglazed clay, made for dried grasses rather than cut flowers. The surface is burnished rather than glazed, so it darkens slightly where it is handled.',
    category: 'vases',
    price_cents: 7800,
    stock_quantity: 14,
    dimensions: '24 cm tall, 17 cm across',
    materials: 'Earthenware, burnished, unglazed',
  },
  {
    slug: 'oxblood-vase',
    name: 'Oxblood Vase',
    description:
      'A copper-red glaze that comes out of the kiln differently every firing. This one is deep at the shoulder and thins toward the foot. Thirty centimetres, single stem.',
    category: 'vases',
    price_cents: 9600,
    stock_quantity: 6,
    dimensions: '30 cm tall, 12 cm across',
    materials: 'Porcelain, copper-red glaze',
  },
  {
    slug: 'cobalt-column-vase',
    name: 'Cobalt Column Vase',
    description:
      'A straight-sided column in a speckled cobalt glaze, heavy enough in the base to hold branches without a stone. The speckle is iron in the clay coming through the glaze.',
    category: 'vases',
    price_cents: 11000,
    stock_quantity: 8,
    dimensions: '34 cm tall, 13 cm across',
    materials: 'Stoneware, speckled cobalt glaze',
  },
  {
    slug: 'smoke-glaze-vase',
    name: 'Smoke Glaze Vase',
    description:
      'Fired in a reduction kiln so the glaze pulls toward black at the rim and grey at the belly. Holds a handful of grasses, or nothing at all.',
    category: 'vases',
    price_cents: 8400,
    stock_quantity: 11,
    dimensions: '19 cm tall, 10 cm across',
    materials: 'Stoneware, reduction fired',
  },
  {
    slug: 'stoneware-teapot',
    name: 'Stoneware Teapot',
    description:
      'A one-litre teapot with a cane handle and a spout that has been tested against a table for drips. The lid sits in a recessed gallery so it stays put when you pour.',
    category: 'tableware',
    price_cents: 8800,
    stock_quantity: 12,
    dimensions: '16 cm tall · 1 l',
    materials: 'Stoneware, cane handle',
  },
  {
    slug: 'butter-dish',
    name: 'Butter Dish',
    description:
      'Sized for a standard block with room to cut from it. The lid is unglazed inside so it does not sweat in a warm kitchen.',
    category: 'tableware',
    price_cents: 3200,
    stock_quantity: 26,
    dimensions: '18 × 10 cm, 7 cm tall',
    materials: 'Porcelain, unglazed interior lid',
  },
  {
    slug: 'teapot-trio',
    name: 'Teapot Trio',
    description:
      'Three small teapots in a pale, a sand and a red clay, each holding roughly two cups. Sold together because the three glazes were mixed from one batch and will not recur.',
    category: 'tableware',
    price_cents: 14500,
    stock_quantity: 4,
    dimensions: '12 cm tall each · 500 ml each',
    materials: 'Three clays, one firing',
  },
  {
    slug: 'tall-pitcher',
    name: 'Tall Pitcher',
    description:
      'A litre and a half, with a pulled handle and a lip drawn out far enough to pour water cleanly. Doubles as a vase, which is mostly what ours end up doing.',
    category: 'tableware',
    price_cents: 6400,
    stock_quantity: 18,
    dimensions: '24 cm tall · 1.5 l',
    materials: 'Stoneware, pulled handle',
  },
  {
    slug: 'gilt-rim-plate',
    name: 'Gilt Rim Plate',
    description:
      'A side plate finished with a thin band of gold lustre at the rim, fired a third time to set it. Hand wash only, which is the price of the gold.',
    category: 'tableware',
    price_cents: 3800,
    stock_quantity: 20,
    dimensions: '20 cm across',
    materials: 'Porcelain, gold lustre rim',
  },
  {
    slug: 'studio-mug-set',
    name: 'Studio Mug Set',
    description:
      'Four mugs from a single firing, so the speckle runs consistently across the set. Two hundred and fifty millilitres each, stackable two high.',
    category: 'tableware',
    price_cents: 7200,
    stock_quantity: 15,
    dimensions: '9 cm tall · 250 ml each · set of four',
    materials: 'Stoneware, speckled glaze',
  },
  {
    slug: 'butter-glaze-plate',
    name: 'Butter Glaze Plate',
    description:
      'A soft yellow glaze that reads as cream under warm light and lemon under daylight. Twenty-two centimetres, with a rim shallow enough to stack.',
    category: 'tableware',
    price_cents: 3000,
    stock_quantity: 30,
    dimensions: '22 cm across',
    materials: 'Stoneware, butter-yellow glaze',
  },
  {
    slug: 'tumbler-set',
    name: 'Tumbler Set',
    description:
      'Six straight-sided tumblers, no handles, for water or wine depending on the evening. The unglazed foot gives them grip on a wet worktop.',
    category: 'tableware',
    price_cents: 6800,
    stock_quantity: 16,
    dimensions: '10 cm tall · 300 ml each · set of six',
    materials: 'Stoneware, unglazed foot',
  },
  {
    slug: 'ridged-tumblers',
    name: 'Ridged Tumblers',
    description:
      'Thrown with three deep ridges so they sit in the hand without a handle. Glazed in a run of soft pastels mixed for one kiln only.',
    category: 'tableware',
    price_cents: 5600,
    stock_quantity: 13,
    dimensions: '9 cm tall · 250 ml each · set of four',
    materials: 'Stoneware, pastel glazes',
  },
  {
    slug: 'taper-candle-holders',
    name: 'Taper Candle Holders',
    description:
      'Three low holders for standard tapers, weighted so a tall candle does not tip. The dish catches wax, which saves the tablecloth.',
    category: 'lighting',
    price_cents: 4600,
    stock_quantity: 22,
    dimensions: '5 cm tall, 11 cm dish · set of three',
    materials: 'Porcelain, fits standard tapers',
  },
  {
    slug: 'stone-candle-set',
    name: 'Stone Candle Set',
    description:
      'Candles poured into cast stone vessels that keep their use once the wax is gone. Unscented, because a dining table already smells of dinner.',
    category: 'lighting',
    price_cents: 5800,
    stock_quantity: 17,
    dimensions: '8-14 cm across · set of four',
    materials: 'Cast stone, unscented soy wax',
  },
  {
    slug: 'bedside-lamp',
    name: 'Bedside Lamp',
    description:
      'A thrown ceramic base under a linen shade, wired for a standard bulb with an inline switch on the flex. Warm enough to read by, dim enough to leave on.',
    category: 'lighting',
    price_cents: 16500,
    stock_quantity: 7,
    dimensions: '34 cm tall, 20 cm shade',
    materials: 'Stoneware base, linen shade, E14',
  },
  {
    slug: 'globe-wall-light',
    name: 'Globe Wall Light',
    description:
      'An opal glass globe on a solid brass arm that will patinate rather than lacquer off. Hard wired, so it wants an electrician and a wall.',
    category: 'lighting',
    price_cents: 19800,
    stock_quantity: 5,
    dimensions: '32 cm out from the wall, 15 cm globe',
    materials: 'Solid brass, opal glass, hard wired',
  },
  {
    slug: 'fluted-pendant',
    name: 'Fluted Pendant',
    description:
      'A fluted porcelain shade that throws light down and glows at the edge. Hung from a braided flex, drop adjustable up to a metre and a half.',
    category: 'lighting',
    price_cents: 17500,
    stock_quantity: 6,
    dimensions: '28 cm across, 40 cm drop',
    materials: 'Porcelain, brass arm, E27',
  },
  {
    slug: 'oak-book-table',
    name: 'Oak Book Table',
    description:
      'A side table with an open bay beneath it, sized for the books you are partway through. Solid oak, oiled, joined without visible fixings.',
    category: 'furniture',
    price_cents: 34000,
    stock_quantity: 4,
    dimensions: '48 × 40 cm, 52 cm tall',
    materials: 'Solid oak, oiled, no visible fixings',
  },
  {
    slug: 'oak-wall-shelf',
    name: 'Oak Wall Shelf',
    description:
      'A ninety centimetre shelf on bracket supports cut from the same board, so the grain runs through. Rated for a row of books or a row of pots, not both.',
    category: 'furniture',
    price_cents: 14500,
    stock_quantity: 9,
    dimensions: '90 × 22 cm, 18 kg rated',
    materials: 'Solid oak, oiled',
  },
  {
    slug: 'weathered-stool',
    name: 'Weathered Stool',
    description:
      'A low stool in reclaimed timber left to grey, for a hallway or a greenhouse. The legs are wedged through the seat rather than glued, so it can be knocked apart and re-wedged.',
    category: 'furniture',
    price_cents: 12000,
    stock_quantity: 8,
    dimensions: '42 cm tall, 34 × 26 cm seat',
    materials: 'Reclaimed timber, wedged joints',
  },
  {
    slug: 'washed-linen-napkins',
    name: 'Washed Linen Napkins',
    description:
      'Four napkins in heavy washed linen, hemmed by hand and softened before they leave. They crease, which is the point; ironing them flat rather defeats the object.',
    category: 'textiles',
    price_cents: 4800,
    stock_quantity: 14,
    dimensions: '45 × 45 cm each',
    materials: 'Washed linen, hand-hemmed',
  },
  {
    slug: 'linen-bread-cloth',
    name: 'Linen Bread Cloth',
    description:
      'A loose-weave cloth for proving under or carrying a loaf in. Open enough to breathe, heavy enough to hold its folds, and it takes a flour dusting without complaint.',
    category: 'textiles',
    price_cents: 2600,
    stock_quantity: 22,
    dimensions: '60 × 60 cm',
    materials: 'Loose-weave linen',
  },
  {
    slug: 'studio-apron',
    name: 'Studio Apron',
    description:
      'The apron we wear at the wheel, cut long with a cross-back strap so nothing pulls on the neck. It stiffens with clay and softens again in the wash, which is how you can tell a worn one.',
    category: 'textiles',
    price_cents: 7200,
    stock_quantity: 11,
    dimensions: 'One size, 86 cm long',
    materials: 'Heavyweight linen, brass rivets',
  },
  {
    slug: 'heavy-linen-throw',
    name: 'Heavy Linen Throw',
    description:
      'A throw with a hemstitched border, in the weight that sits still rather than sliding off a chair. Warmer than it looks and much cooler than wool in a hot room.',
    category: 'textiles',
    price_cents: 14500,
    stock_quantity: 6,
    dimensions: '130 × 180 cm',
    materials: 'Heavy linen, hemstitched border',
  },
  {
    slug: 'linen-table-runner',
    name: 'Linen Table Runner',
    description:
      'Long enough to overhang a six-seat table at both ends, in the same washed linen as the napkins. It is the quickest way to make a plain table look as though somebody meant it.',
    category: 'textiles',
    price_cents: 5400,
    stock_quantity: 9,
    dimensions: '45 × 200 cm',
    materials: 'Washed linen, hand-hemmed',
  },
  {
    slug: 'lidded-keepsake-box',
    name: 'Lidded Keepsake Box',
    description:
      'Walnut with a lift-off lid, mitred at the corners so the grain runs unbroken around all four sides. Oiled inside as well as out, which most boxes are not.',
    category: 'storage',
    price_cents: 9800,
    stock_quantity: 7,
    dimensions: '24 × 14 cm, 9 cm deep',
    materials: 'Solid walnut, hardwax oil',
  },
  {
    slug: 'turned-serving-trays',
    name: 'Turned Serving Trays',
    description:
      'A long tray and a short one, cut from the same oak board so they read as a pair. The lipped ends give you somewhere to get a thumb under when both hands are full.',
    category: 'storage',
    price_cents: 8600,
    stock_quantity: 10,
    dimensions: '46 × 14 cm and 30 × 12 cm',
    materials: 'Solid oak, hardwax oil',
  },
  {
    slug: 'stoneware-storage-jars',
    name: 'Stoneware Storage Jars',
    description:
      'Two lidded jars for salt, coffee or whatever else wants keeping dry. The lids are ground to their own jar, so they are not interchangeable and each is marked underneath.',
    category: 'storage',
    price_cents: 7400,
    stock_quantity: 12,
    dimensions: '12 cm and 9 cm tall',
    materials: 'Stoneware, unglazed rims',
  },
  {
    slug: 'turned-walnut-bowl',
    name: 'Turned Walnut Bowl',
    description:
      'Turned from a single block and finished with oil rather than lacquer, so the grain stays legible. Dry fruit, keys, whatever collects by a door.',
    category: 'storage',
    price_cents: 11200,
    stock_quantity: 5,
    dimensions: '26 cm across, 8 cm deep',
    materials: 'Solid walnut, food-safe oil',
  },
  {
    slug: 'carved-catch-all',
    name: 'Carved Catch-All',
    description:
      'A shallow bowl with the tool marks left in, cut in rows across the outside. Made to be picked up, which is why the underside is worked as carefully as the rim.',
    category: 'storage',
    price_cents: 13800,
    stock_quantity: 4,
    dimensions: '22 cm across, 7 cm deep',
    materials: 'Carved walnut, hardwax oil',
  },
]

const client = await pool.connect()
try {
  await client.query('BEGIN')
  await client.query('TRUNCATE order_items, orders, cart_items, carts, products RESTART IDENTITY CASCADE')
  for (const p of products) {
    await client.query(
      `INSERT INTO products (slug, name, description, category, price_cents, stock_quantity, dimensions, materials, specs, image_url, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        p.slug,
        p.name,
        p.description,
        p.category,
        p.price_cents,
        p.stock_quantity,
        p.dimensions,
        p.materials,
        JSON.stringify(productSpecs[p.slug] ?? {}),
        `/images/${p.slug}.jpg`,
        p.is_featured ?? false,
      ],
    )
  }
  for (const [slug, facets] of Object.entries(productFacets)) {
    await client.query('UPDATE products SET material_tags = $1, color = $2 WHERE slug = $3', [
      facets.materials,
      facets.color,
      slug,
    ])
  }

  // A few things on sale, so the badge and the struck-through price are visible.
  await client.query(`UPDATE products SET sale_price_cents = round(price_cents * 0.75)
     WHERE slug IN ('harvest-vase', 'ridged-tumblers', 'weathered-stool', 'globe-wall-light')`)

  await client.query('COMMIT')
  console.log(`Seeded ${products.length} products, four on sale`)
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
}

try {
  await seedDemoUsers()
  console.log('Seeded the demo shopper and demo admin')
  console.log(`Seeded ${await seedDemoReviews()} reviews`)
  console.log(`Seeded ${await seedDemoOrders()} orders across the last 90 days`)
} finally {
  await pool.end()
}
