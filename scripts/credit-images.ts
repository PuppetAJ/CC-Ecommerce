import { readFileSync, writeFileSync } from 'node:fs'

// Unsplash's guidelines ask that using a photo pings its download endpoint.
const key = process.env.UNSPLASH_ACCESS_KEY
if (!key) throw new Error('UNSPLASH_ACCESS_KEY is not set')
const headers = { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' }

type Credit = { file: string; source?: string; id: string; photographer: string; profile: string; credited?: boolean }
const credits = JSON.parse(readFileSync('public/images/credits.json', 'utf8')) as Credit[]

// Unsplash's demo tier allows 50 requests an hour, so already-credited photos are
// skipped and the run can be repeated until nothing is pending.
for (const credit of credits) {
  if (credit.credited) continue
  // editorial-bench comes from Pexels, which has no download endpoint to ping.
  if (credit.source && credit.source !== 'unsplash') continue
  if (!credit.profile) {
    const res = await fetch(`https://api.unsplash.com/photos/${credit.id}`, { headers })
    if (res.ok) {
      const photo = (await res.json()) as { user: { name: string; links: { html: string } } }
      credit.photographer = photo.user.name
      credit.profile = photo.user.links.html
    }
  }
  const res = await fetch(`https://api.unsplash.com/photos/${credit.id}/download`, { headers })
  if (res.ok) credit.credited = true
  console.log(`${res.ok ? 'ok  ' : `${res.status} `} ${credit.file}  ${credit.photographer}`)
}

writeFileSync('public/images/credits.json', JSON.stringify(credits, null, 2) + '\n')
const pending = credits.filter((c) => !c.credited)
console.log(
  `\n${credits.length - pending.length} of ${credits.length} credited${pending.length ? `, ${pending.length} pending — rerun when the rate limit resets` : ''}`,
)
