import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

// Downloads the approved photographs and records their credits; Unsplash resizes on their CDN.
const meta = existsSync('/tmp/imgmeta.json')
  ? (JSON.parse(readFileSync('/tmp/imgmeta.json', 'utf8')) as {
      urls: Record<string, string>
      who: Record<string, { name: string; profile: string }>
    })
  : { urls: {}, who: {} }

const key = process.env.UNSPLASH_ACCESS_KEY

/** The contact sheet is a scratch file; anything missing from it is looked up by id instead. */
async function lookup(id: string): Promise<{ url: string; name: string; profile: string }> {
  if (meta.urls[id]) {
    const who = meta.who[id] ?? { name: 'Unknown', profile: '' }
    return { url: meta.urls[id], name: who.name, profile: who.profile }
  }
  if (!key) throw new Error(`${id} is not in the contact sheet and UNSPLASH_ACCESS_KEY is not set`)
  const res = await fetch(`https://api.unsplash.com/photos/${id}`, {
    headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' },
  })
  if (!res.ok) throw new Error(`Unsplash ${res.status} looking up ${id}`)
  const photo = (await res.json()) as { urls: { small: string }; user: { name: string; links: { html: string } } }
  return { url: photo.urls.small, name: photo.user.name, profile: photo.user.links.html }
}

const assignments: { file: string; id: string }[] = [
  { file: 'washed-linen-napkins', id: 'tC-TOGGEODI' },
  { file: 'linen-bread-cloth', id: 'bTJe8Wseia0' },
  { file: 'studio-apron', id: 'ymSFRIA1mBM' },
  { file: 'heavy-linen-throw', id: 'kwepwyvPWmM' },
  { file: 'linen-table-runner', id: 'jM3gtQbSjnM' },
  { file: 'lidded-keepsake-box', id: 'GKlMfgZ2fpw' },
  { file: 'turned-serving-trays', id: 'MzJ6pzgLtC0' },
  { file: 'stoneware-storage-jars', id: 'oiZAQvxTcYQ' },
  { file: 'turned-walnut-bowl', id: 'Xig5z9fr0Kc' },
  { file: 'carved-catch-all', id: '5OeWJCvGJ7w' },
  { file: 'ridge-breakfast-mug', id: 'n42ogaQn32o' },
  { file: 'deep-serving-bowl', id: 'Mz__0nr1AM8' },
  { file: 'stacking-bowl-pair', id: 'bgIO-u4GEfI' },
  { file: 'salt-cellar', id: 'oHrC8V_XRU4' },
  { file: 'everyday-side-plate', id: 'YA2E3d7a9Wo' },
  { file: 'ash-glaze-dinner-plate', id: '7HuTGlUfQSo' },
  { file: 'tall-stem-vase', id: 'r0u8YuXfaho' },
  { file: 'wide-mouth-vessel', id: 'jKg4C87JB3U' },
  // The shipped hero-teaware.jpg is sharpened by hand afterwards; re-running this overwrites that.
  { file: 'hero-teaware', id: 'Xow_RU8rcv4' },
  { file: 'hanging-pendant-shade', id: 'aRcwkYv7870' },
  { file: 'kiln-table-lamp', id: '-Gem15xQAE4' },
  { file: 'ash-dining-table', id: 'DefZwLAfxlw' },
  { file: 'oak-dining-chair', id: 'iBxQvOLuKb4' },
  { file: 'elm-side-table', id: 'XFQwJqKtqoQ' },
  { file: 'low-workshop-stool', id: '8nIlgyWAChI' },
  { file: 'editorial-wheel', id: 'P7X0np30w30' },
  { file: 'editorial-timber', id: 'GfYA6q5ESLI' },
  { file: 'editorial-shelf', id: 'JSdmb3YqKwg' },
  { file: 'editorial-throwing', id: 'QRVSQH7OeX4' },
  { file: 'editorial-studio', id: 'sFRTV8QvTDg' },
]

mkdirSync('public/images', { recursive: true })

type Credit = { file: string; id: string; photographer: string; profile: string; source?: string; credited?: boolean }
// Merged, not replaced: running this for a handful of new products must not drop the credits
// already earned by the rest, nor the flags recording that Unsplash has been pinged.
const existing: Credit[] = existsSync('public/images/credits.json')
  ? (JSON.parse(readFileSync('public/images/credits.json', 'utf8')) as Credit[])
  : []
const byFile = new Map(existing.map((credit) => [credit.file, credit]))

// Anything already on disk is left alone unless FORCE=1: hero-teaware is sharpened by hand
// after downloading, and a re-run for new products used to quietly overwrite that work.
const force = process.env.FORCE === '1'

// ONLY=a,b narrows a forced run to a few files, so re-fetching three originals does not touch the rest.
const only = new Set((process.env.ONLY ?? '').split(',').filter(Boolean))

for (const { file, id } of assignments) {
  if (only.size > 0 && !only.has(file)) continue
  if (!force && existsSync(`public/images/${file}.jpg`) && byFile.has(file)) {
    console.log(`${file}.jpg  kept`)
    continue
  }
  const photo = await lookup(id)
  const url = `${photo.url.split('?')[0]}?fm=jpg&q=78&w=1600&fit=max&cs=tinysrgb`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} downloading ${id}`)
  const bytes = Buffer.from(await res.arrayBuffer())
  writeFileSync(`public/images/${file}.jpg`, bytes)
  // A re-fetch of the same photograph keeps its credited flag; a new one starts without.
  const was = byFile.get(file)
  byFile.set(file, { ...was, file, id, photographer: photo.name, profile: photo.profile })
  console.log(`${file}.jpg  ${(bytes.length / 1024).toFixed(0)}kb  ${photo.name}`)
}

const credits = [...byFile.values()].sort((a, b) => a.file.localeCompare(b.file))
writeFileSync('public/images/credits.json', JSON.stringify(credits, null, 2) + '\n')
console.log(`\n${credits.length} images credited in public/images/credits.json`)
