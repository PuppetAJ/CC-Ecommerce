import sharp from 'sharp'

/**
 * Some photographs put their subject right across the frame. The shop crops to a square, which
 * takes a third of the width off a 3:2 photograph, so those subjects lose their ends. Sliding
 * the crop around only chooses which third to lose.
 *
 * So the photograph is squared before it is ever cropped: the picture sits full width on a
 * blurred, scaled-up copy of itself. Repeating the edge row instead was the first attempt and
 * it streaked wherever that row had detail in it; a blur reads as depth of field and cannot.
 */
const wide = ['carved-catch-all', 'lidded-keepsake-box', 'turned-serving-trays']

for (const slug of wide) {
  const file = `public/images/${slug}.jpg`
  const source = await sharp(file).toBuffer()
  const { width = 0, height = 0 } = await sharp(source).metadata()
  if (width === height) {
    console.log(`${slug}  already square`)
    continue
  }

  const ground = await sharp(source)
    .resize(width, width, { fit: 'cover', position: 'center' })
    .blur(48)
    .modulate({ brightness: 1.02, saturation: 0.9 })
    .toBuffer()

  const bytes = await sharp(ground)
    .composite([{ input: source, top: Math.round((width - height) / 2), left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer()

  await sharp(bytes).toFile(file)
  console.log(`${slug}  ${width}×${height} -> ${width}×${width}  ${(bytes.length / 1024).toFixed(0)}kb`)
}
