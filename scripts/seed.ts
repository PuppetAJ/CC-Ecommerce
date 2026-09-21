import { pool } from '../src/lib/db/pool.ts'
import { seedDemoOrders } from './demo-orders.ts'
import { seedDemoMessages } from './demo-messages.ts'
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
    description: 'Thrown with a ridge under the rim so it sits against your lip. Holds a full ten ounces.',
    category: 'tableware',
    price_cents: 2800,
    stock_quantity: 40,
    dimensions: '3.5 in tall, 3.5 in across · 10 fl oz',
    materials: 'Stoneware, clear glaze',
    is_featured: true,
  },
  {
    slug: 'ash-glaze-dinner-plate',
    name: 'Ash Glaze Dinner Plate',
    description:
      'The glaze is mixed from wood ash out of our own kiln, so no two plates break the same way across the rim. Ten inches across.',
    category: 'tableware',
    price_cents: 3400,
    stock_quantity: 32,
    dimensions: '10 in across, 1 in deep',
    materials: 'Stoneware, wood ash glaze',
  },
  {
    slug: 'deep-serving-bowl',
    name: 'Deep Serving Bowl',
    description:
      'Wide enough for a salad for six and deep enough that the dressing stays in it. The foot is left unglazed so it grips a wooden table.',
    category: 'tableware',
    price_cents: 5600,
    stock_quantity: 18,
    dimensions: '11 in across, 4.5 in deep · 2.5 qt',
    materials: 'Stoneware, matte white glaze',
  },
  {
    slug: 'everyday-side-plate',
    name: 'Everyday Side Plate',
    description:
      'The plate we use most. Eight inches, stacks four deep in a standard cabinet, and holds up to being carried by the edge.',
    category: 'tableware',
    price_cents: 2200,
    stock_quantity: 60,
    dimensions: '8.5 in across',
    materials: 'Stoneware, speckled glaze',
  },
  {
    slug: 'stacking-bowl-pair',
    name: 'Stacking Bowl Pair',
    description:
      'Two bowls thrown to nest inside each other, so they take one shelf instead of two. The smaller holds a breakfast portion, the larger a full one.',
    category: 'tableware',
    price_cents: 4800,
    stock_quantity: 24,
    dimensions: '6.5 in across, 3 in deep · 17 fl oz each',
    materials: 'Stoneware, speckled glaze',
  },
  {
    slug: 'salt-cellar',
    name: 'Salt Cellar',
    description:
      'Open-topped and wide enough for a pinch between two fingers. Unglazed inside, which keeps flaked salt dry longer than a lidded pot does.',
    category: 'tableware',
    price_cents: 1800,
    stock_quantity: 0,
    dimensions: '3 in across, 2 in tall',
    materials: 'Stoneware, unglazed foot',
  },
  {
    slug: 'tall-stem-vase',
    name: 'Tall Stem Vase',
    description:
      'Narrow at the neck, so a single branch stays where you put it. Sixteen inches, and heavy enough in the base not to tip.',
    category: 'vases',
    price_cents: 6800,
    stock_quantity: 14,
    dimensions: '8.5 in tall, 4.5 in across the belly',
    materials: 'Stoneware, matte white glaze',
    is_featured: true,
  },
  {
    slug: 'wide-mouth-vessel',
    name: 'Wide Mouth Vessel',
    description: 'Made for armfuls, not arrangements. A vase in summer and a place for kindling the rest of the year.',
    category: 'vases',
    price_cents: 8900,
    stock_quantity: 9,
    dimensions: '7 in across, 5.5 in tall',
    materials: 'Porcelain, carved, unglazed',
  },
  {
    slug: 'kiln-table-lamp',
    name: 'Kiln Table Lamp',
    description:
      "A thrown stoneware base with a linen shade, wired for a standard socket. The base is weighted, so a tug on the cord won't pull it over.",
    category: 'lighting',
    price_cents: 18500,
    stock_quantity: 8,
    dimensions: '17 in tall, 10 in shade',
    materials: 'Stoneware base, opal glass shade, E26',
    is_featured: true,
  },
  {
    slug: 'hanging-pendant-shade',
    name: 'Hanging Pendant Shade',
    description:
      'Glazed outside and left white inside, so the light stays warm instead of tinted. Fits a standard pendant cord, not included.',
    category: 'lighting',
    price_cents: 11200,
    stock_quantity: 15,
    dimensions: '9.5 in across, 7 in deep',
    materials: 'Porcelain, braided cord, E26',
  },
  {
    slug: 'spouted-pendant',
    name: 'Spouted Pendant',
    description:
      'A thrown pendant with two cut spouts that throw light sideways as well as down. Hangs on a braided cord, adjustable to about three feet.',
    category: 'lighting',
    price_cents: 5400,
    stock_quantity: 22,
    dimensions: '10 in tall, 4.5 in across',
    materials: 'Stoneware, braided cord, E12',
  },
  {
    slug: 'column-table-lamp',
    name: 'Column Table Lamp',
    description:
      'A straight linen shade on a slim column, for a hallway table or the end of a counter. Inline switch on the cord, standard bulb.',
    category: 'lighting',
    price_cents: 14900,
    stock_quantity: 6,
    dimensions: '18 in tall, 5.5 in shade',
    materials: 'Linen shade, steel column, E12',
  },
  {
    slug: 'oak-dining-chair',
    name: 'Oak Dining Chair',
    description:
      'Solid oak, mortise and tenon, no screws in the frame. Oil finished, so a scratch can be rubbed out at home instead of sent away.',
    category: 'furniture',
    price_cents: 42000,
    stock_quantity: 10,
    dimensions: '31 in tall, 18 in seat height',
    materials: 'Solid oak, oiled',
  },
  {
    slug: 'ash-dining-table',
    name: 'Ash Dining Table',
    description:
      'Six feet long and seats six comfortably. The top is a single glued panel, and the legs come off to get it through a doorway.',
    category: 'furniture',
    price_cents: 128000,
    stock_quantity: 3,
    dimensions: '71 × 35 in, 29 in tall',
    materials: 'Ash top, brushed steel base',
    is_featured: true,
  },
  {
    slug: 'low-workshop-stool',
    name: 'Low Workshop Stool',
    description:
      'The stool we sit on at the wheel, built to last. Eighteen inches tall with three legs, so it never rocks on an uneven floor.',
    category: 'furniture',
    price_cents: 19500,
    stock_quantity: 16,
    dimensions: '18 in tall, 16 × 11 in seat',
    materials: 'Reclaimed pine, oiled',
  },
  {
    slug: 'elm-side-table',
    name: 'Elm Side Table',
    description:
      'Light enough to move with one hand and heavy enough to hold a lamp. Elm, so the grain does the decorating.',
    category: 'furniture',
    price_cents: 36000,
    stock_quantity: 7,
    dimensions: '22 × 14 in, 18 in tall',
    materials: 'Solid elm, oiled',
  },
  {
    slug: 'harvest-vase',
    name: 'Harvest Vase',
    description:
      "A wide-bellied vase in warm unglazed clay, made for dried grasses rather than cut flowers. The surface is burnished, not glazed, so it darkens a little where it's handled.",
    category: 'vases',
    price_cents: 7800,
    stock_quantity: 14,
    dimensions: '9.5 in tall, 6.5 in across',
    materials: 'Earthenware, burnished, unglazed',
  },
  {
    slug: 'oxblood-vase',
    name: 'Oxblood Vase',
    description:
      'A copper-red glaze that comes out of the kiln differently every firing. This one is deep at the shoulder and thins toward the foot. Twelve inches, single stem.',
    category: 'vases',
    price_cents: 9600,
    stock_quantity: 6,
    dimensions: '12 in tall, 4.5 in across',
    materials: 'Porcelain, copper-red glaze',
  },
  {
    slug: 'cobalt-column-vase',
    name: 'Cobalt Column Vase',
    description:
      'A straight-sided column in a speckled cobalt glaze, heavy enough in the base to hold branches without a stone. The speckle is iron in the clay showing through.',
    category: 'vases',
    price_cents: 11000,
    stock_quantity: 8,
    dimensions: '13 in tall, 5 in across',
    materials: 'Stoneware, speckled cobalt glaze',
  },
  {
    slug: 'smoke-glaze-vase',
    name: 'Smoke Glaze Vase',
    description:
      'Fired in a reduction kiln, so the glaze pulls toward black at the rim and gray at the belly. Holds a handful of grasses, or nothing at all.',
    category: 'vases',
    price_cents: 8400,
    stock_quantity: 11,
    dimensions: '7.5 in tall, 4 in across',
    materials: 'Stoneware, reduction fired',
  },
  {
    slug: 'stoneware-teapot',
    name: 'Stoneware Teapot',
    description:
      "A one-quart teapot with a cane handle and a spout we've tested for drips. The lid sits in a recessed gallery so it stays put when you pour.",
    category: 'tableware',
    price_cents: 8800,
    stock_quantity: 12,
    dimensions: '6.5 in tall · 1 qt',
    materials: 'Stoneware, cane handle',
  },
  {
    slug: 'butter-dish',
    name: 'Butter Dish',
    description:
      "Sized for a standard block with room to cut from it. The lid is unglazed inside, so it doesn't sweat in a warm kitchen.",
    category: 'tableware',
    price_cents: 3200,
    stock_quantity: 26,
    dimensions: '7 × 4 in, 3 in tall',
    materials: 'Porcelain, unglazed interior lid',
  },
  {
    slug: 'teapot-trio',
    name: 'Teapot Trio',
    description:
      "Three small teapots in pale, sand and red clay, each holding about two cups. Sold as a set because the three glazes were mixed from one batch and won't be repeated.",
    category: 'tableware',
    price_cents: 14500,
    stock_quantity: 4,
    dimensions: '4.5 in tall each · 17 fl oz each',
    materials: 'Three clays, one firing',
  },
  {
    slug: 'tall-pitcher',
    name: 'Tall Pitcher',
    description:
      'A quart and a half, with a pulled handle and a lip drawn out far enough to pour cleanly. Doubles as a vase, which is what most of ours end up doing.',
    category: 'tableware',
    price_cents: 6400,
    stock_quantity: 18,
    dimensions: '9.5 in tall · 1.5 qt',
    materials: 'Stoneware, pulled handle',
  },
  {
    slug: 'gilt-rim-plate',
    name: 'Gilt Rim Plate',
    description:
      "A side plate with a thin band of gold luster at the rim, fired a third time to set it. Hand wash only. That's the price of the gold.",
    category: 'tableware',
    price_cents: 3800,
    stock_quantity: 20,
    dimensions: '8 in across',
    materials: 'Porcelain, gold luster rim',
  },
  {
    slug: 'studio-mug-set',
    name: 'Studio Mug Set',
    description:
      'Four mugs from a single firing, so the speckle matches across the set. Eight ounces each, and they stack two high.',
    category: 'tableware',
    price_cents: 7200,
    stock_quantity: 15,
    dimensions: '3.5 in tall · 8 fl oz each · set of four',
    materials: 'Stoneware, speckled glaze',
  },
  {
    slug: 'butter-glaze-plate',
    name: 'Butter Glaze Plate',
    description:
      'A soft yellow glaze that reads as cream in warm light and lemon in daylight. Nine inches, with a rim shallow enough to stack.',
    category: 'tableware',
    price_cents: 3000,
    stock_quantity: 30,
    dimensions: '8.5 in across',
    materials: 'Stoneware, butter-yellow glaze',
  },
  {
    slug: 'tumbler-set',
    name: 'Tumbler Set',
    description:
      'Six straight-sided tumblers with no handles, for water or wine. The unglazed foot keeps them from sliding on a wet counter.',
    category: 'tableware',
    price_cents: 6800,
    stock_quantity: 16,
    dimensions: '4 in tall · 10 fl oz each · set of six',
    materials: 'Stoneware, unglazed foot',
  },
  {
    slug: 'ridged-tumblers',
    name: 'Ridged Tumblers',
    description:
      'Thrown with three deep ridges, so they sit in the hand without a handle. Glazed in a run of soft pastels mixed for one kiln only.',
    category: 'tableware',
    price_cents: 5600,
    stock_quantity: 13,
    dimensions: '3.5 in tall · 8 fl oz each · set of four',
    materials: 'Stoneware, pastel glazes',
  },
  {
    slug: 'taper-candle-holders',
    name: 'Taper Candle Holders',
    description:
      "Three low holders for standard tapers, weighted so a tall candle won't tip. The dish catches the wax and saves the tablecloth.",
    category: 'lighting',
    price_cents: 4600,
    stock_quantity: 22,
    dimensions: '2 in tall, 4.5 in dish · set of three',
    materials: 'Porcelain, fits standard tapers',
  },
  {
    slug: 'stone-candle-set',
    name: 'Stone Candle Set',
    description:
      'Candles poured into cast stone vessels that stay useful after the wax is gone. Unscented, because a dinner table already smells like dinner.',
    category: 'lighting',
    price_cents: 5800,
    stock_quantity: 17,
    dimensions: '3-5.5 in across · set of four',
    materials: 'Cast stone, unscented soy wax',
  },
  {
    slug: 'bedside-lamp',
    name: 'Bedside Lamp',
    description:
      'A thrown ceramic base under a linen shade, wired for a standard bulb with an inline switch on the cord. Warm enough to read by and dim enough to leave on.',
    category: 'lighting',
    price_cents: 16500,
    stock_quantity: 7,
    dimensions: '13 in tall, 8 in shade',
    materials: 'Stoneware base, linen shade, E12',
  },
  {
    slug: 'globe-wall-light',
    name: 'Globe Wall Light',
    description:
      'An opal glass globe on a solid brass arm that will patina instead of flake. Hard wired, so it needs an electrician and a wall.',
    category: 'lighting',
    price_cents: 19800,
    stock_quantity: 5,
    dimensions: '13 in out from the wall, 6 in globe',
    materials: 'Solid brass, opal glass, hard wired',
  },
  {
    slug: 'fluted-pendant',
    name: 'Fluted Pendant',
    description:
      'A fluted porcelain shade that throws light down and glows at the edge. Hangs from a braided cord, adjustable up to five feet.',
    category: 'lighting',
    price_cents: 17500,
    stock_quantity: 6,
    dimensions: '11 in across, 16 in drop',
    materials: 'Porcelain, brass arm, E26',
  },
  {
    slug: 'oak-book-table',
    name: 'Oak Book Table',
    description:
      "A side table with an open bay underneath, sized for the books you're partway through. Solid oak, oiled, joined without visible fasteners.",
    category: 'furniture',
    price_cents: 34000,
    stock_quantity: 4,
    dimensions: '19 × 16 in, 20 in tall',
    materials: 'Solid oak, oiled, no visible fixings',
  },
  {
    slug: 'oak-wall-shelf',
    name: 'Oak Wall Shelf',
    description:
      'A three-foot shelf on brackets cut from the same board, so the grain runs through. Rated for a row of books or a row of pots, not both.',
    category: 'furniture',
    price_cents: 14500,
    stock_quantity: 9,
    dimensions: '35 × 8.5 in, 40 lb rated',
    materials: 'Solid oak, oiled',
  },
  {
    slug: 'weathered-stool',
    name: 'Weathered Stool',
    description:
      'A low stool in reclaimed wood left to go gray, for a hallway or a porch. The legs are wedged through the seat instead of glued, so it can be knocked apart and re-wedged.',
    category: 'furniture',
    price_cents: 12000,
    stock_quantity: 8,
    dimensions: '17 in tall, 13 × 10 in seat',
    materials: 'Reclaimed wood, wedged joints',
  },
  {
    slug: 'washed-linen-napkins',
    name: 'Washed Linen Napkins',
    description:
      "Four napkins in heavy washed linen, hemmed by hand and softened before they leave. They crease, and that's the point.",
    category: 'textiles',
    price_cents: 4800,
    stock_quantity: 14,
    dimensions: '18 × 18 in each',
    materials: 'Washed linen, hand-hemmed',
  },
  {
    slug: 'linen-bread-cloth',
    name: 'Linen Bread Cloth',
    description:
      "A loose-weave cloth for proofing dough under or carrying a loaf in. Open enough to breathe, heavy enough to hold its folds, and it doesn't mind a dusting of flour.",
    category: 'textiles',
    price_cents: 2600,
    stock_quantity: 22,
    dimensions: '24 × 24 in',
    materials: 'Loose-weave linen',
  },
  {
    slug: 'studio-apron',
    name: 'Studio Apron',
    description:
      'The apron we wear at the wheel, cut long with a cross-back strap so nothing pulls on your neck. It stiffens with clay and softens again in the wash.',
    category: 'textiles',
    price_cents: 7200,
    stock_quantity: 11,
    dimensions: 'One size, 34 in long',
    materials: 'Heavyweight linen, brass rivets',
  },
  {
    slug: 'heavy-linen-throw',
    name: 'Heavy Linen Throw',
    description:
      'A throw with a hemstitched border, in a weight that stays put instead of sliding off the chair. Warmer than it looks and cooler than wool in a hot room.',
    category: 'textiles',
    price_cents: 14500,
    stock_quantity: 6,
    dimensions: '51 × 71 in',
    materials: 'Heavy linen, hemstitched border',
  },
  {
    slug: 'linen-table-runner',
    name: 'Linen Table Runner',
    description:
      'Long enough to overhang a six-seat table at both ends, in the same washed linen as the napkins. The quickest way to make a plain table look intentional.',
    category: 'textiles',
    price_cents: 5400,
    stock_quantity: 9,
    dimensions: '18 × 79 in',
    materials: 'Washed linen, hand-hemmed',
  },
  {
    slug: 'lidded-keepsake-box',
    name: 'Lidded Keepsake Box',
    description:
      "Walnut with a lift-off lid, mitered at the corners so the grain runs unbroken around all four sides. Oiled inside as well as out, which most boxes aren't.",
    category: 'storage',
    price_cents: 9800,
    stock_quantity: 7,
    dimensions: '9.5 × 5.5 in, 3.5 in deep',
    materials: 'Solid walnut, hardwax oil',
  },
  {
    slug: 'turned-serving-trays',
    name: 'Turned Serving Trays',
    description:
      'A long tray and a short one, cut from the same oak board so they read as a pair. The lipped ends give you somewhere to get a thumb under when your hands are full.',
    category: 'storage',
    price_cents: 8600,
    stock_quantity: 10,
    dimensions: '18 × 5.5 in and 12 × 4.5 in',
    materials: 'Solid oak, hardwax oil',
  },
  {
    slug: 'stoneware-storage-jars',
    name: 'Stoneware Storage Jars',
    description:
      'Two lidded jars for salt, coffee, or anything else that needs to stay dry. Each lid is ground to fit its own jar and marked underneath.',
    category: 'storage',
    price_cents: 7400,
    stock_quantity: 12,
    dimensions: '4.5 in and 3.5 in tall',
    materials: 'Stoneware, unglazed rims',
  },
  {
    slug: 'turned-walnut-bowl',
    name: 'Turned Walnut Bowl',
    description:
      'Turned from a single block and finished with oil instead of lacquer, so the grain stays visible. Fruit, keys, whatever collects by the door.',
    category: 'storage',
    price_cents: 11200,
    stock_quantity: 5,
    dimensions: '10 in across, 3 in deep',
    materials: 'Solid walnut, food-safe oil',
  },
  {
    slug: 'carved-catch-all',
    name: 'Carved Catch-All',
    description:
      'A shallow bowl with the tool marks left in, cut in rows across the outside. Made to be picked up, so the underside is finished as carefully as the rim.',
    category: 'storage',
    price_cents: 13800,
    stock_quantity: 4,
    dimensions: '8.5 in across, 3 in deep',
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
  console.log(`Seeded ${await seedDemoMessages()} messages to the studio`)
} finally {
  await pool.end()
}
