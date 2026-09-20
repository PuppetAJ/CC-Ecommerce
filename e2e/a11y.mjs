// axe-core at WCAG 2.1 A and AA, both themes. Needs the app running.
import { createRequire } from 'node:module'
import { chromium } from 'playwright'
import { BASE } from './lib.mjs'

const AXE_PATH = createRequire(import.meta.url).resolve('axe-core/axe.min.js')
const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

const pages = [
  ['landing', '/'],
  ['shop', '/shop'],
  ['shop, filtered', '/shop?category=vases&sort=price-asc'],
  ['shop, nothing found', '/shop?q=zzzznothing'],
  ['product', '/products/ash-dining-table'],
  ['product with reviews', '/products/oak-wall-shelf'],
  ['cart, empty', '/cart'],
  ['login', '/login'],
  ['register', '/register'],
  ['about', '/about'],
  ['faq', '/faq'],
  ['not found', '/definitely-not-a-page'],
]

const browser = await chromium.launch()
let failures = 0

async function audit(page, label, path) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.addScriptTag({ path: AXE_PATH })
  const violations = await page.evaluate(async (tags) => {
    const results = await window.axe.run(document, { runOnly: { type: 'tag', values: tags } })
    return results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => n.html.slice(0, 140)),
    }))
  }, WCAG)

  if (violations.length === 0) {
    console.log(`  PASS  ${label} (${path})`)
    return
  }
  failures += violations.length
  console.log(`  FAIL  ${label} (${path})`)
  for (const v of violations) {
    console.log(`        ${v.id} [${v.impact}] ${v.help}`)
    for (const node of v.nodes.slice(0, 3)) console.log(`          ${node}`)
  }
}

for (const colorScheme of ['light', 'dark']) {
  console.log(`\n${colorScheme} theme`)
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme })
  const page = await context.newPage()
  page.setDefaultTimeout(20_000)
  for (const [label, path] of pages) await audit(page, label, path)

  // Signed-in chrome is a different header, so it gets its own pass.
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Demo shopper' }).click()
  await page.waitForURL(`${BASE}/`)
  await audit(page, 'landing, signed in', '/')
  await audit(page, 'checkout', '/checkout')
  await audit(page, 'your orders', '/account/orders')
  await audit(page, 'favourites', '/account/favourites')
  await context.close()
}

await browser.close()
console.log(`\n${failures === 0 ? 'no accessibility violations' : `${failures} violation(s)`}`)
process.exit(failures === 0 ? 0 : 1)
