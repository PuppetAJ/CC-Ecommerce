import sharp from 'sharp'

/**
 * Some photographs put their subject right across the frame. The shop crops to a square, which
 * takes a third of the width off a 3:2 photograph, so those subjects lose their ends. Sliding
 * the crop around only chooses which third to lose.
 *
 * So the photograph is squared before it is ever cropped. The bands above and below are the
 * photograph's own top and bottom edges, stretched and blurred, so each continues the scene it
 * touches: the wall above, the table below. The earlier version used a blurred copy of the
 * whole picture, which put a ghost of the subject in each band and read as a glitch at tile size.
 */
const wide = ['carved-catch-all', 'lidded-keepsake-box', 'turned-serving-trays']

// Overlap tucks the seam under the photograph; the strip is thin so it carries color, not shapes.
const overlap = 40
const stripShare = 0.1

for (const slug of wide) {
  const file = `public/images/${slug}.jpg`
  const source = await sharp(file).toBuffer()
  const { width = 0, height = 0 } = await sharp(source).metadata()
  if (width === height) {
    console.log(`${slug}  already square`)
    continue
  }

  const pad = Math.round((width - height) / 2)
  const strip = Math.round(height * stripShare)
  const band = (top: number, tall: number) =>
    sharp(source)
      .extract({ left: 0, top, width, height: strip })
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
