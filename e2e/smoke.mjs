// Needs the app running against a seeded database. Throttling runs last: it spends the sign-in budget.
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

section('Cart')
{
  const { context, page: shop } = await freshPage(browser)
  const badge = () => shop.locator('button[aria-label="Open cart"] span').first()

  await shop.goto(`${BASE}/products/ash-dining-table`, { waitUntil: 'networkidle' })
  check('a fresh visitor has no cart badge', (await badge().count()) === 0)

  await shop.getByRole('button', { name: 'Add to cart' }).click()
  await shop.waitForTimeout(2000)
  check('adding opens the cart sheet', await shop.locator('[role="dialog"]').isVisible())
  check('and the badge appears', (await badge().innerText()) === '1')

  const sheet = shop.locator('[role="dialog"]')
  await sheet
    .getByRole('button', { name: /^Add one / })
    .first()
    .click()
  await shop.waitForTimeout(1800)
  check('the stepper changes the quantity', (await badge().innerText()) === '2')
  check('and the subtotal follows it', /2,560/.test(await sheet.innerText()), await sheet.innerText())

  await shop.keyboard.press('Escape')
  await shop.goto(`${BASE}/products/harvest-vase`, { waitUntil: 'networkidle' })
  await shop.getByRole('button', { name: 'Add to cart' }).click()
  await shop.waitForTimeout(2000)
  check('a second product is a second line', (await badge().innerText()) === '3')

  await shop.keyboard.press('Escape')
  await shop.goto(`${BASE}/cart`, { waitUntil: 'networkidle' })
  check('the cart survives a reload', /Ash Dining Table/.test(await visibleText(shop)))

  await shop.getByRole('button', { name: 'Remove', exact: true }).first().click()
  await shop.waitForTimeout(1800)
  check('removing drops the line', !/Ash Dining Table/.test(await visibleText(shop)))
  check('and the badge counts down', (await badge().innerText()) === '1')

  await shop.getByRole('button', { name: 'Remove', exact: true }).first().click()
  await shop.waitForTimeout(1800)
  check('emptying it shows the empty state', /Nothing in here yet/.test(await visibleText(shop)))
  check('and the badge goes', (await badge().count()) === 0)
  await context.close()
}

section('The sheet does not reopen by itself')
{
  const { context, page: shop } = await freshPage(browser)
  const sheet = () =>
    shop
      .locator('[role="dialog"]')
      .isVisible()
      .catch(() => false)

  // Link clicks, not goto: a hard load clears the router cache and hides this entirely.
  await shop.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })
  await shop.locator('a[href="/products/oak-wall-shelf"]').first().click()
  await shop.waitForTimeout(1500)
  await shop.getByRole('button', { name: 'Add to cart' }).click()
  await shop.waitForTimeout(2000)
  check('adding opens the sheet', await sheet())

  await shop.keyboard.press('Escape')
  await shop.waitForTimeout(700)
  check('escape closes it', !(await sheet()))

  await shop.locator('a[href="/shop"]').first().click()
  await shop.waitForTimeout(1500)
  await shop.locator('a[href="/products/oak-wall-shelf"]').first().click()
  await shop.waitForTimeout(2000)
  // The action result rides in the client router cache, so coming back replays it.
  check('coming back to the product does not reopen it', !(await sheet()))

  await shop.getByRole('button', { name: 'Add to cart' }).click()
  await shop.waitForTimeout(2000)
  check('and a genuine add still opens it', await sheet())
  await context.close()
}

section('Carrying a guest cart into an account')
{
  const { context, page: guest } = await freshPage(browser)
  const cartText = async () => {
    await guest.goto(`${BASE}/cart`, { waitUntil: 'networkidle' })
    return visibleText(guest)
  }
  const emptyTheCart = async () => {
    await guest.goto(`${BASE}/cart`, { waitUntil: 'networkidle' })
    for (let line = 0; line < 20; line++) {
      const remove = guest.getByRole('button', { name: 'Remove', exact: true }).first()
      if ((await remove.count()) === 0) break
      await remove.click()
      await guest.waitForTimeout(900)
    }
  }
  const add = async (slug) => {
    await guest.goto(`${BASE}/products/${slug}`, { waitUntil: 'networkidle' })
    await guest.getByRole('button', { name: 'Add to cart' }).click()
    await guest.waitForTimeout(2000)
    await guest.keyboard.press('Escape')
  }
  const signOut = async () => {
    await guest.goto(`${BASE}/`, { waitUntil: 'networkidle' })
    await guest.locator('button[aria-label="Account menu"]').click()
    await guest.getByRole('button', { name: 'Log out' }).click()
    await guest.waitForTimeout(2000)
  }

  // The demo account persists between runs, so the section starts from a known cart
  // rather than assuming a fresh seed, and leaves it empty again at the end.
  await signInAsDemo(guest, 'shopper')
  await emptyTheCart()
  await signOut()

  await add('ash-dining-table')
  await signInAsDemo(guest, 'shopper')
  check('a guest cart follows them into the account', /Ash Dining Table/.test(await cartText()))

  await signOut()
  check('signing out leaves the account cart behind', /Nothing in here yet/.test(await cartText()))

  await add('ash-dining-table')
  await signInAsDemo(guest, 'shopper')
  const merged = await cartText()
  // The account already held one, so the quantities are summed rather than replaced.
  check('the two carts are added together, not replaced', /2,560/.test(merged), merged.slice(0, 200))

  await emptyTheCart()
  check('the demo account is left as it was found', /Nothing in here yet/.test(await cartText()))
  await context.close()
}

section('A claimed cart cannot be reached by its old cookie')
{
  const { context: victimContext, page: victim } = await freshPage(browser)
  await victim.goto(`${BASE}/products/ash-dining-table`, { waitUntil: 'networkidle' })
  await victim.getByRole('button', { name: 'Add to cart' }).click()
  await victim.waitForTimeout(2000)

  const cookie = (await victimContext.cookies()).find((c) => c.name === 'wicken_cart')
  check('the guest cart cookie is httpOnly', Boolean(cookie?.httpOnly))

  await signInAsDemo(victim, 'shopper')

  // Whoever still holds that id must get nothing, because the cart now has an owner.
  const { context: holderContext, page: holder } = await freshPage(browser)
  await holderContext.addCookies([{ name: 'wicken_cart', value: cookie.value, url: BASE }])
  await holder.goto(`${BASE}/cart`, { waitUntil: 'networkidle' })
  const seen = await visibleText(holder)
  check('the old id reads nothing', /Nothing in here yet/.test(seen), seen.slice(0, 140))

  await holder.goto(`${BASE}/products/harvest-vase`, { waitUntil: 'networkidle' })
  await holder.getByRole('button', { name: 'Add to cart' }).click()
  await holder.waitForTimeout(2000)
  await victim.goto(`${BASE}/cart`, { waitUntil: 'networkidle' })
  const victimCart = await visibleText(victim)
  check(
    'and writing with it does not reach the account cart',
    !/Harvest Vase/.test(victimCart),
    victimCart.slice(0, 160),
  )
  await holderContext.close()

  // Leave the demo account as it was found.
  for (let line = 0; line < 20; line++) {
    const remove = victim.getByRole('button', { name: 'Remove', exact: true }).first()
    if ((await remove.count()) === 0) break
    await remove.click()
    await victim.waitForTimeout(900)
  }
  await victimContext.close()
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
