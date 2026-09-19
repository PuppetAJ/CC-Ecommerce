/** Shared setup for the browser suites. Mirrors the one in Chunkd. */
import { chromium } from 'playwright'

export const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:3000'

// Matches scripts/demo-users.ts; the suite runs against a seeded database.
export const demo = {
  shopper: { email: 'shopper@wicken.store', password: 'demo-password', name: 'Demo Shopper' },
  admin: { email: 'admin@wicken.store', password: 'demo-password', name: 'Demo Admin' },
}

export async function launch({ width = 1280, height = 900, colorScheme = 'light' } = {}) {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width, height }, colorScheme })
  const page = await context.newPage()
  page.setDefaultTimeout(20_000)
  page.setDefaultNavigationTimeout(30_000)

  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  return { browser, context, page, pageErrors, close: () => browser.close() }
}

/** A fresh context, so a signed-in check cannot leak its cookies into the next one. */
export async function freshPage(browser, options = {}) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, ...options })
  const page = await context.newPage()
  page.setDefaultTimeout(20_000)
  return { context, page }
}

export function reporter() {
  const results = []
  let lastCheckAt = Date.now()

  function check(name, ok, detail = '') {
    results.push({ name, ok, ms: Date.now() - lastCheckAt })
    lastCheckAt = Date.now()
    console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${ok || !detail ? '' : `   — ${detail}`}`)
  }

  function section(title) {
    console.log(`\n${title}`)
  }

  /** Returns the exit code rather than exiting, so the caller can close the browser first. */
  function report(pageErrors = []) {
    const failed = results.filter((r) => !r.ok)
    console.log(`\n${results.length - failed.length} passed, ${failed.length} failed`)

    if (pageErrors.length) {
      console.log(`\nUncaught page errors (${pageErrors.length}):`)
      for (const message of [...new Set(pageErrors)].slice(0, 10)) console.log('  - ' + message.slice(0, 200))
    }

    return failed.length === 0 && pageErrors.length === 0 ? 0 : 1
  }

  return { check, section, report, results }
}

/** The stamp keeps a rerun from colliding with the account the last one made. */
export function newShopper() {
  const stamp = Date.now()
  return { name: 'E2E Shopper', email: `e2e${stamp}@wicken.test`, password: 'a-long-enough-password' }
}

export async function signInWithForm(page, { email, password }, next) {
  await page.goto(`${BASE}/login${next ? `?next=${encodeURIComponent(next)}` : ''}`, { waitUntil: 'networkidle' })
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.getByRole('button', { name: 'Log in' }).click()
}

export async function signInAsDemo(page, role = 'shopper') {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: role === 'admin' ? 'Demo admin' : 'Demo shopper' }).click()
  await page.waitForURL(role === 'admin' ? `${BASE}/admin` : `${BASE}/`)
}

export async function openAccountMenu(page) {
  await page.locator('button[aria-label="Account menu"]').click()
  return page.locator('[role="menu"]').innerText()
}

/** Visible text with the scripts stripped, for asserting on what a person would actually read. */
export async function visibleText(page) {
  return page.locator('body').innerText()
}
