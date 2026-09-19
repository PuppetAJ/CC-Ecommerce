import { mkdirSync, writeFileSync } from 'node:fs'

const key = process.env.UNSPLASH_ACCESS_KEY
if (!key) throw new Error('UNSPLASH_ACCESS_KEY is not set')

type Photo = {
  id: string
  width: number
  alt_description: string | null
  urls: { small: string; regular: string }
  user: { name: string; links: { html: string } }
}

type Candidate = { id: string; thumb: string; alt: string; photographer: string; profile: string }

const perGroup = 15

const groups: { name: string; want: number; queries: string[] }[] = [
  {
    name: 'Tableware',
    want: 6,
    queries: ['stoneware mug', 'ceramic bowl handmade', 'ceramic plate minimal', 'handmade tableware'],
  },
  { name: 'Vases', want: 5, queries: ['ceramic vase minimal', 'stoneware vase', 'pottery vase still life'] },
  { name: 'Lighting', want: 4, queries: ['table lamp linen shade', 'ceramic pendant lamp', 'candle holder ceramic'] },
  {
    name: 'Furniture',
    want: 5,
    queries: ['wooden dining chair', 'oak dining table', 'wooden stool minimal', 'wooden bench interior'],
  },
  {
    name: 'Editorial',
    want: 5,
    queries: ['pottery workshop hands', 'ceramic studio shelves', 'potters wheel', 'woodworking workshop'],
  },
]

async function search(query: string): Promise<Photo[]> {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=24&orientation=landscape`
  const res = await fetch(url, { headers: { Authorization: `Client-ID ${key}`, 'Accept-Version': 'v1' } })
  if (!res.ok) throw new Error(`Unsplash ${res.status} for "${query}"`)
  const body = (await res.json()) as { results: Photo[] }
  // plus.unsplash.com is the paid tier, which our licence does not cover.
  return body.results.filter((p) => !p.urls.regular.startsWith('https://plus') && p.width >= 1600)
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
const seen = new Set<string>()
const sections: { name: string; want: number; candidates: Candidate[] }[] = []

for (const group of groups) {
  // Round-robin the queries so one search term cannot fill the whole group.
  const perQuery = await Promise.all(group.queries.map(search))
  const candidates: Candidate[] = []
  for (let i = 0; candidates.length < perGroup && i < 24; i++) {
    for (const results of perQuery) {
      const photo = results[i]
      if (!photo || seen.has(photo.id) || candidates.length >= perGroup) continue
      seen.add(photo.id)
      candidates.push({
        id: photo.id,
        thumb: photo.urls.small,
        alt: photo.alt_description ?? '',
        photographer: photo.user.name,
        profile: photo.user.links.html,
      })
    }
  }
  sections.push({ name: group.name, want: group.want, candidates })
  console.log(`${group.name}: ${candidates.length} candidates`)
}

const tile = (c: Candidate, group: string) => `
    <label class="tile" data-id="${c.id}" data-group="${group}">
      <input type="checkbox">
      <img src="${c.thumb}" alt="${escape(c.alt)}" loading="lazy">
      <span class="meta"><a href="${c.profile}" target="_blank" rel="noreferrer">${escape(c.photographer)}</a><code>${c.id}</code></span>
    </label>`

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Wicken contact sheet</title>
<style>
  :root { color-scheme: light dark; --bg:#f4f3ef; --fg:#1a1a17; --muted:#6b6a63; --line:#0002; }
  @media (prefers-color-scheme: dark) { :root { --bg:#141412; --fg:#f0efe9; --muted:#9a988e; --line:#fff3; } }
  body { margin:0 0 64px; background:var(--bg); color:var(--fg); font:15px/1.5 ui-sans-serif,system-ui,sans-serif; }
  header { position:sticky; top:0; background:var(--bg); border-bottom:1px solid var(--line); padding:16px 24px; z-index:2; }
  h1 { font-size:18px; margin:0 0 4px; }
  h2 { font-size:15px; margin:28px 24px 10px; scroll-margin-top:140px; }
  p { margin:0 0 8px; color:var(--muted); font-size:13px; }
  #picked { width:100%; box-sizing:border-box; font:12px ui-monospace,monospace; padding:8px;
            border:1px solid var(--line); border-radius:6px; background:transparent; color:var(--fg); min-height:56px; }
  .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:12px; padding:0 24px; }
  .tile { display:block; cursor:pointer; border:2px solid transparent; border-radius:8px; overflow:hidden; background:#8881; }
  .tile:has(:checked) { border-color:currentColor; }
  .tile input { position:absolute; opacity:0; pointer-events:none; }
  .tile img { display:block; width:100%; aspect-ratio:4/3; object-fit:cover; }
  .meta { display:flex; justify-content:space-between; gap:8px; padding:6px 8px; font-size:11px; color:var(--muted); }
  .meta a { color:inherit; }
  code { font-size:10px; opacity:.7; }
</style></head><body>
<header>
  <h1>Wicken contact sheet</h1>
  <p>Click to select. Aim for ${sections.map((s) => `${s.want} ${s.name.toLowerCase()}`).join(', ')}. Copy the box below back to me.</p>
  <textarea id="picked" readonly placeholder="Selected ids appear here"></textarea>
</header>
${sections.map((s) => `  <h2>${s.name} — pick ${s.want}</h2>\n  <div class="grid">${s.candidates.map((c) => tile(c, s.name)).join('')}\n  </div>`).join('\n')}
<script>
  const out = document.getElementById('picked')
  document.addEventListener('change', () => {
    out.value = [...document.querySelectorAll('.tile:has(:checked)')]
      .map((t) => t.dataset.group + ': ' + t.dataset.id)
      .join('\\n')
  })
</script>
</body></html>`

mkdirSync('docs', { recursive: true })
writeFileSync('docs/contact-sheet.html', html)
console.log(`\nWrote docs/contact-sheet.html with ${seen.size} candidates`)
