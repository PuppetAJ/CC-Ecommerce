import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Unsplash's API guidelines ask that using a photo triggers its download
 * endpoint, which is how photographers are credited with a use. Also fills in
 * any profile link the contact sheet did not record.
 */
const key = process.env.UNSPLASH_ACCESS_KEY
if (!key) throw new Error('UNSPLASH_ACCESS_KEY is not set')
const headers = { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' }

type Credit = { file: string; id: string; photographer: string; profile: string }
const credits = JSON.parse(readFileSync('public/images/credits.json', 'utf8')) as Credit[]

for (const credit of credits) {
  if (!credit.profile) {
    const res = await fetch(`https://api.unsplash.com/photos/${credit.id}`, { headers })
    if (res.ok) {
      const photo = (await res.json()) as { user: { name: string; links: { html: string } } }
      credit.photographer = photo.user.name
      credit.profile = photo.user.links.html
    }
  }
  const res = await fetch(`https://api.unsplash.com/photos/${credit.id}/download`, { headers })
  console.log(`${res.ok ? 'ok  ' : `${res.status} `} ${credit.file}  ${credit.photographer}`)
}

writeFileSync('public/images/credits.json', JSON.stringify(credits, null, 2) + '\n')
const missing = credits.filter((c) => !c.profile)
console.log(`\n${credits.length} photos credited${missing.length ? `, ${missing.length} without a profile link` : ''}`)
