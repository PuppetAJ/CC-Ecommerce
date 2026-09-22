import sharp from 'sharp'

/** A blurred copy ghosted the subject, so the bands stretch the photograph's own top and bottom edges. */
const banded = ['carved-catch-all', 'turned-serving-trays']

// Where the subject only fills part of a wide frame, a square cut from it beats bands around it.
const cropped: Record<string, { left: number; top: number; side: number }> = {
  'lidded-keepsake-box': { left: 130, top: 45, side: 1555 },
}

// Overlap tucks the seam under the photograph; the strip is thin so it carries color, not shapes.
const overlap = 40
const stripShare = 0.1

for (const [slug, { left, top, side }] of Object.entries(cropped)) {
  const file = `public/images/${slug}.jpg`
  const { width = 0, height = 0 } = await sharp(file).metadata()
  if (width === height) {
    console.log(`${slug}  already square`)
    continue
  }
  if (left + side > width || top + side > height) {
    throw new Error(`${slug}: a ${side}px square at ${left},${top} does not fit in ${width}×${height}`)
  }

  const bytes = await sharp(await sharp(file).toBuffer())
    .extract({ left, top, width: side, height: side })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()

  await sharp(bytes).toFile(file)
  console.log(`${slug}  ${width}×${height} -> ${side}×${side}  ${(bytes.length / 1024).toFixed(0)}kb`)
}

for (const slug of banded) {
  const file = `public/images/${slug}.jpg`
  const source = await sharp(file).toBuffer()
  const { width = 0, height = 0 } = await sharp(source).metadata()
  if (width === height) {
    console.log(`${slug}  already square`)
    continue
  }

  const pad = Math.round((width - height) / 2)
  const strip = Math.round(height * stripShare)
  const band = (bandTop: number, tall: number) =>
    sharp(source)
      .extract({ left: 0, top: bandTop, width, height: strip })
      .resize(width, tall, { fit: 'fill' })
      .blur(70)
      .modulate({ saturation: 0.85 })
      .toBuffer()

  const above = await band(0, pad + overlap)
  const below = await band(height - strip, width - pad - height + overlap)

  const bytes = await sharp({ create: { width, height: width, channels: 3, background: '#e9e7e2' } })
    .composite([
      { input: above, top: 0, left: 0 },
      { input: below, top: pad + height - overlap, left: 0 },
      { input: source, top: pad, left: 0 },
    ])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()

  await sharp(bytes).toFile(file)
  console.log(`${slug}  ${width}×${height} -> ${width}×${width}  ${(bytes.length / 1024).toFixed(0)}kb`)
}
