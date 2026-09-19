import { pool } from '../src/lib/db/pool.ts'
import type { Category } from '../src/lib/db/types.ts'

type Seed = {
  slug: string
  name: string
  description: string
  category: Category
  price_cents: number
  stock_quantity: number
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
  },
  {
    slug: 'deep-serving-bowl',
    name: 'Deep Serving Bowl',
    description:
      'Wide enough for a salad for six, deep enough that dressing stays in it. The foot is left unglazed so it grips a wooden table.',
    category: 'tableware',
    price_cents: 5600,
    stock_quantity: 18,
  },
  {
    slug: 'everyday-side-plate',
    name: 'Everyday Side Plate',
    description:
      'The plate we use most. Eighteen centimetres, stacks four deep in a standard cupboard, and survives being carried by the edge.',
    category: 'tableware',
    price_cents: 2200,
    stock_quantity: 60,
  },
  {
    slug: 'stacking-bowl-pair',
    name: 'Stacking Bowl Pair',
    description:
      'Two bowls thrown to nest inside one another, so they take one shelf rather than two. The smaller holds a breakfast portion, the larger a proper one.',
    category: 'tableware',
    price_cents: 4800,
    stock_quantity: 24,
  },
  {
    slug: 'salt-cellar',
    name: 'Salt Cellar',
    description:
      'Open-topped, wide enough for a pinch between two fingers. Unglazed inside, which keeps flaked salt dry for longer than a lidded pot does.',
    category: 'tableware',
    price_cents: 1800,
    stock_quantity: 0,
  },
  {
    slug: 'tall-stem-vase',
    name: 'Tall Stem Vase',
    description:
      'Narrow at the neck so a single branch stands where you put it. Forty centimetres, and heavy enough in the base not to go over.',
    category: 'vases',
    price_cents: 6800,
    stock_quantity: 14,
    is_featured: true,
  },
  {
    slug: 'round-bud-vase',
    name: 'Round Bud Vase',
    description: 'For the three stems left over from a bunch. Sits comfortably on a windowsill or a bedside table.',
    category: 'vases',
    price_cents: 2600,
    stock_quantity: 45,
  },
  {
    slug: 'wide-mouth-vessel',
    name: 'Wide Mouth Vessel',
    description:
      'Built for armfuls rather than arrangements. Works as a vase in summer and as a place for kindling the rest of the year.',
    category: 'vases',
    price_cents: 8900,
    stock_quantity: 9,
  },
  {
    slug: 'paired-bottle-vases',
    name: 'Paired Bottle Vases',
    description:
      'Sold as a pair, thrown to different heights on purpose. Two stems in two bottles reads better than six in one.',
    category: 'vases',
    price_cents: 7400,
    stock_quantity: 12,
  },
  {
    slug: 'kiln-table-lamp',
    name: 'Kiln Table Lamp',
    description:
      'A thrown stoneware base with a linen shade, wired for a standard screw fitting. The base is weighted so the cable can be tugged without consequence.',
    category: 'lighting',
    price_cents: 18500,
    stock_quantity: 8,
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
  },
  {
    slug: 'candle-holder-trio',
    name: 'Candle Holder Trio',
    description:
      'Three heights, one glaze, sized for ordinary dinner candles. They read as a group without matching exactly.',
    category: 'lighting',
    price_cents: 5400,
    stock_quantity: 22,
  },
  {
    slug: 'wall-sconce',
    name: 'Wall Sconce',
    description:
      'Throws light up a wall rather than into a room. Hard-wired, so allow for an electrician unless you already have a point.',
    category: 'lighting',
    price_cents: 14900,
    stock_quantity: 6,
  },
  {
    slug: 'oak-dining-chair',
    name: 'Oak Dining Chair',
    description:
      'Solid oak, mortise and tenon, no screws in the frame. Oil-finished so a scratch can be rubbed out rather than sent away.',
    category: 'furniture',
    price_cents: 42000,
    stock_quantity: 10,
  },
  {
    slug: 'ash-dining-table',
    name: 'Ash Dining Table',
    description:
      'One hundred and eighty centimetres, seats six without anyone apologising. The top is a single glued panel, and the legs come off for a doorway.',
    category: 'furniture',
    price_cents: 128000,
    stock_quantity: 3,
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
  },
  {
    slug: 'elm-side-table',
    name: 'Elm Side Table',
    description:
      'Small enough to move with one hand and heavy enough to take a lamp. Elm, so the grain does the decoration.',
    category: 'furniture',
    price_cents: 36000,
    stock_quantity: 7,
  },
]

const client = await pool.connect()
try {
  await client.query('BEGIN')
  await client.query('TRUNCATE order_items, orders, cart_items, carts, products RESTART IDENTITY CASCADE')
  for (const p of products) {
    await client.query(
      `INSERT INTO products (slug, name, description, category, price_cents, stock_quantity, image_url, is_featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        p.slug,
        p.name,
        p.description,
        p.category,
        p.price_cents,
        p.stock_quantity,
        `/images/${p.slug}.jpg`,
        p.is_featured ?? false,
      ],
    )
  }
  await client.query('COMMIT')
  console.log(`Seeded ${products.length} products`)
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally {
  client.release()
  await pool.end()
}
