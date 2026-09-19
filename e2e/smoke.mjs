// Needs the app running against a seeded database; see docs/TESTING.md, which also explains the section order.
import {
  BASE,
  demo,
  freshPage,
  launch,
  newShopper,
  openAccountMenu,
  reporter,
  signInAsDemo,
  signInWithForm,
  visibleText,
} from './lib.mjs'

const { browser, page, pageErrors, close } = await launch()
const { check, section, report } = reporter()

section('Catalogue')
{
  await page.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })
  const all = await page.locator('a[href^="/products/"]').count()
  check('the shop lists the seeded catalogue', all >= 30, `${all} tiles`)

  await page.goto(`${BASE}/shop?category=vases`, { waitUntil: 'networkidle' })
  const vases = await page.locator('a[href^="/products/"]').count()
  check('a category narrows the grid', vases > 0 && vases < all, `${vases} of ${all}`)

  await page.goto(`${BASE}/shop?q=teapot`, { waitUntil: 'networkidle' })
  const found = await page.locator('a[href^="/products/"]').count()
  check('search narrows the grid', found > 0 && found < all, `${found} for "teapot"`)

  await page.goto(`${BASE}/shop?q=zzzznothing`, { waitUntil: 'networkidle' })
  const none = await page.locator('a[href^="/products/"]').count()
  check('a search that matches nothing returns nothing', none === 0, `${none} tiles — a 200 is not a passing test`)

  await page.goto(`${BASE}/shop?category=bogus&sort=bogus`, { waitUntil: 'networkidle' })
  const bogus = await page.locator('a[href^="/products/"]').count()
  check('nonsense search params fall back rather than throwing', bogus >= 30, `${bogus} tiles`)
}

section('Product page')
{
  await page.goto(`${BASE}/products/ash-dining-table`, { waitUntil: 'networkidle' })
  const text = await visibleText(page)
  check('the product page shows its price', /\$\d/.test(text))
  check('dimensions are visible without opening anything', /Dimensions/i.test(text))
  check('related products are offered', (await page.locator('a[href^="/products/"]').count()) > 0)

  const beforeAccordion = await page.locator('button[aria-label^="View"]').boundingBox()
  await page.getByRole('button', { name: /Product information/i }).click()
  await page.waitForTimeout(500)
  const afterAccordion = await page.locator('button[aria-label^="View"]').boundingBox()
  check(
    'opening the accordion does not stretch the photograph',
    Math.abs(beforeAccordion.height - afterAccordion.height) < 2,
    `${Math.round(beforeAccordion.height)} then ${Math.round(afterAccordion.height)}`,
  )
}

section('Image magnifier')
{
  const trigger = page.locator('button[aria-label^="View"]').first()
  const image = trigger.locator('img')
  const box = await trigger.boundingBox()

  check('the photograph rests unscaled', (await image.evaluate((e) => getComputedStyle(e).transform)) === 'none')

  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25)
  await page.waitForTimeout(400)
  const scaled = await image.evaluate((e) => getComputedStyle(e).transform)
  const originTopLeft = await image.evaluate((e) => getComputedStyle(e).transformOrigin)
  check('hovering magnifies it', scaled.startsWith('matrix(2.2'), scaled)
  check('the anchor follows the cursor', originTopLeft.startsWith(`${Math.round(box.width * 0.25)}px`), originTopLeft)

  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.75)
  await page.waitForTimeout(400)
  const originBottomRight = await image.evaluate((e) => getComputedStyle(e).transformOrigin)
  check('the anchor moves with it', originBottomRight !== originTopLeft, originBottomRight)

  await page.mouse.move(5, 5)
  await page.waitForTimeout(400)
  check('leaving resets it', (await image.evaluate((e) => getComputedStyle(e).transform)) === 'none')

  await trigger.click()
  await page.waitForTimeout(600)
  check('clicking opens the whole frame', await page.locator('[role="dialog"]').isVisible())
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)
  check('escape closes it', (await page.locator('[role="dialog"]').count()) === 0)
}

section('A missing product')
{
  const response = await page.goto(`${BASE}/products/does-not-exist`, { waitUntil: 'networkidle' })
  const text = await visibleText(page)
  // The product segment has its own not-found copy; the global one is a different page.
  check('it shows the product not-found page', /do not make that one/i.test(text), text.slice(0, 120))
  check(
    'it is marked noindex',
    (await page.locator('meta[name="robots"]').count()) > 0,
    `status was ${response.status()}`,
  )
  check('no product markup is served', !/Add to cart/i.test(text))
}

section('Registering')
{
  const { context, page: fresh } = await freshPage(browser)
  const shopper = newShopper()
  await fresh.goto(`${BASE}/register`, { waitUntil: 'networkidle' })
  await fresh.fill('input[name="name"]', shopper.name)
  await fresh.fill('input[name="email"]', shopper.email)
  await fresh.fill('input[name="password"]', shopper.password)
  await fresh.getByRole('button', { name: 'Create account' }).click()
  await fresh.waitForURL(`${BASE}/`)
  check('registering signs the new account in', (await openAccountMenu(fresh)).includes(shopper.email))
  await context.close()
}

section('Signing in and out')
{
  const { context, page: fresh } = await freshPage(browser)
  await signInAsDemo(fresh, 'shopper')
  const menu = await openAccountMenu(fresh)
  check('the demo shopper signs in', menu.includes(demo.shopper.name))
  check('the shopper menu offers no admin link', !menu.includes('Admin'))

  await fresh.getByRole('button', { name: 'Log out' }).click()
  await fresh.waitForTimeout(1500)
  check(
    'signing out restores the signed-out header',
    await fresh.getByRole('link', { name: 'Sign up' }).first().isVisible(),
  )
  await context.close()
}

section('Authorisation')
{
  const { context: shopperContext, page: shopper } = await freshPage(browser)
  await signInAsDemo(shopper, 'shopper')
  await shopper.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  const blocked = await visibleText(shopper)
  check('a shopper cannot reach the admin area', /not here/i.test(blocked), blocked.split('\n').slice(0, 2).join(' | '))
  check('and is served none of its markup', !/phase 8/i.test(await shopper.content()))
  await shopperContext.close()

  const { context: adminContext, page: admin } = await freshPage(browser)
  await signInAsDemo(admin, 'admin')
  check('the demo admin can', /Admin/.test(await visibleText(admin)))
  // /admin sits outside the (store) layout, so the header is only on the store pages.
  await admin.goto(`${BASE}/`, { waitUntil: 'networkidle' })
  check('and the admin menu links there', (await openAccountMenu(admin)).includes('Admin'))
  await adminContext.close()

  const { context: forgedContext, page: forged } = await freshPage(browser)
  await forgedContext.addCookies([{ name: 'better-auth.session_token', value: 'forged.nonsense', url: BASE }])
  await forged.goto(`${BASE}/account/orders`, { waitUntil: 'networkidle' })
  check('a forged cookie gets past the proxy but not the page', !/Your orders/i.test(await visibleText(forged)))
  await forgedContext.close()
}

section('Where login sends you afterwards')
{
  const { context, page: fresh } = await freshPage(browser)
  await fresh.goto(`${BASE}/account/orders`, { waitUntil: 'networkidle' })
  check('the proxy redirects a signed-out visitor', fresh.url().includes('next=%2Faccount%2Forders'), fresh.url())

  await fresh.fill('input[name="email"]', demo.shopper.email)
  await fresh.fill('input[name="password"]', demo.shopper.password)
  await fresh.getByRole('button', { name: 'Log in' }).click()
  await fresh.waitForURL(`${BASE}/account/orders`)
  check('and login returns them to where they were aiming', fresh.url().endsWith('/account/orders'))
  await context.close()

  for (const [label, target] of [
    ['an absolute URL', 'https://example.com/evil'],
    ['a protocol-relative URL', '//example.com/evil'],
  ]) {
    const { context: c, page: p } = await freshPage(browser)
    await signInWithForm(p, demo.shopper, target)
    await p.waitForURL((url) => !url.pathname.startsWith('/login')).catch(() => {})
    check(`${label} is refused as a redirect target`, new URL(p.url()).pathname === '/', p.url())
    await c.close()
  }
}

section('Throttling')
{
  const { context, page: fresh } = await freshPage(browser)
  let message = ''
  let trippedAt = 0
  for (let attempt = 1; attempt <= 10 && !trippedAt; attempt++) {
    await signInWithForm(fresh, { email: demo.shopper.email, password: 'definitely-wrong-x' })
    await fresh
      .locator('p[role="alert"]')
      .waitFor()
      .catch(() => {})
    message = await fresh
      .locator('p[role="alert"]')
      .innerText()
      .catch(() => '')
    if (/Too many/i.test(message)) trippedAt = attempt
  }
  check('repeated wrong passwords are throttled', trippedAt > 0, `ten attempts all answered: ${message}`)
  check('a wrong password does not say whether the account exists', !/no account|unknown|not found/i.test(message))
  await context.close()
}

await close()
process.exit(report(pageErrors))
