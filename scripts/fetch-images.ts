import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

/**
 * Downloads the approved photographs at a sensible width and records their
 * credits. Unsplash resizes on their CDN, so no local image pipeline is needed;
 * `next/image` handles format and responsive sizes at request time.
 */
const meta = JSON.parse(readFileSync('/tmp/imgmeta.json', 'utf8')) as {
  urls: Record<string, string>
  who: Record<string, { name: string; profile: string }>
}

const assignments: { file: string; id: string }[] = [
  { file: 'ridge-breakfast-mug', id: 'n42ogaQn32o' },
  { file: 'deep-serving-bowl', id: 'Mz__0nr1AM8' },
  { file: 'stacking-bowl-pair', id: 'bgIO-u4GEfI' },
  { file: 'salt-cellar', id: 'oHrC8V_XRU4' },
  { file: 'everyday-side-plate', id: 'YA2E3d7a9Wo' },
  { file: 'ash-glaze-dinner-plate', id: '7HuTGlUfQSo' },
  { file: 'round-bud-vase', id: 'aFvxASlms2A' },
  { file: 'paired-bottle-vases', id: 'Gm1JXx_PA1Q' },
  { file: 'tall-stem-vase', id: 'r0u8YuXfaho' },
  { file: 'wide-mouth-vessel', id: 'jKg4C87JB3U' },
  { file: 'hero-vases', id: 'yCdCM36X4mc' },
  { file: 'hero-windowsill', id: '4yYK5SiGj6E' },
  // The shipped hero-teaware.jpg is sharpened by hand afterwards; re-running this overwrites that.
  { file: 'hero-teaware', id: 'Xow_RU8rcv4' },
  { file: 'hanging-pendant-shade', id: 'aRcwkYv7870' },
  { file: 'wall-sconce', id: '-QrJeaADUBM' },
  { file: 'candle-holder-trio', id: 'X9SuSIoUcJA' },
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
const credits: { file: string; id: string; photographer: string; profile: string }[] = []

for (const { file, id } of assignments) {
  const small = meta.urls[id]
  if (!small) throw new Error(`No URL recorded for ${id}`)
  const url = `${small.split('?')[0]}?fm=jpg&q=78&w=1600&fit=max&cs=tinysrgb`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} downloading ${id}`)
  const bytes = Buffer.from(await res.arrayBuffer())
  writeFileSync(`public/images/${file}.jpg`, bytes)
  const w = meta.who[id] ?? { name: 'Unknown', profile: '' }
  credits.push({ file, id, photographer: w.name, profile: w.profile })
  console.log(`${file}.jpg  ${(bytes.length / 1024).toFixed(0)}kb  ${w.name}`)
}

writeFileSync('public/images/credits.json', JSON.stringify(credits, null, 2) + '\n')
console.log(`\n${credits.length} images, credits written to public/images/credits.json`)
