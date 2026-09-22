import { writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const ink = '#26241f'
const light = '#f3f1ec'

// The same rowan as src/components/elements/logo.tsx, drawn a little smaller so it sits inside a tile.
const rowan = `<g fill="none" stroke="${light}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 20v-6.4" />
    <circle cx="12" cy="6.6" r="3.1" />
    <circle cx="7.7" cy="11.1" r="2.8" />
    <circle cx="16.3" cy="11.1" r="2.8" />
  </g>`

// A browser tab shows the tile as drawn, so it keeps its corners. iOS and Google crop to their own
// shape, so those get a full-bleed square with room around the mark for the corners they cut off.
function tile({ pad, radius, size }: { pad: number; radius: number; size: number }): string {
  const span = 24 + pad * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${span} ${span}" width="${size}" height="${size}">
  <rect x="${-pad}" y="${-pad}" width="${span}" height="${span}" rx="${radius}" fill="${ink}" />
  ${rowan}
</svg>
`
}

await writeFile('src/app/icon.svg', tile({ pad: 0, radius: 5, size: 32 }))
console.log('src/app/icon.svg  32×32')

const rasters: [string, number][] = [
  ['src/app/apple-icon.png', 180],
  ['public/logo.png', 512],
]

for (const [file, size] of rasters) {
  const bytes = await sharp(Buffer.from(tile({ pad: 3, radius: 0, size })))
    .png()
    .toBuffer()
  await writeFile(file, bytes)
  console.log(`${file}  ${size}×${size}  ${(bytes.length / 1024).toFixed(1)}kb`)
}
