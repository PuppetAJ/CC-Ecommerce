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

section('Finding your way back')
{
  const { context, page: nav } = await freshPage(browser)
  const filtered = `${BASE}/shop?category=furniture&sort=price-asc`

  await nav.goto(filtered, { waitUntil: 'networkidle' })
  const href = await nav.locator('a[href^="/products/"]').first().getAttribute('href')
  check(
    'a product link carries the filters',
    href.includes('category=furniture') && href.includes('sort=price-asc'),
    href,
  )

  await nav.locator('a[href^="/products/"]').first().click()
  await nav.waitForTimeout(1500)
  const crumbs = await nav.locator('nav[aria-label="Breadcrumb"]').innerText()
  check('the product page offers a way back', /Back to results/.test(crumbs), crumbs.replace(/\n/g, ' '))

  await nav.locator('nav[aria-label="Breadcrumb"] a').first().click()
  await nav.waitForTimeout(1500)
  check(
    'and it lands on the same results',
    nav.url().includes('category=furniture') && nav.url().includes('sort=price-asc'),
    nav.url(),
  )

  // Landing on a product directly has no filters to go back to.
  await nav.goto(`${BASE}/products/ash-dining-table`, { waitUntil: 'networkidle' })
  check('arriving cold says Shop instead', /Shop/.test(await nav.locator('nav[aria-label="Breadcrumb"]').innerText()))

  await nav.goto(filtered, { waitUntil: 'networkidle' })
  const loginHref = await nav.getByRole('banner').getByRole('link', { name: 'Log in' }).getAttribute('href')
  check('the header login link remembers where you are', loginHref.includes('next='), loginHref)

  await nav.getByRole('banner').getByRole('link', { name: 'Log in' }).click()
  await nav.waitForTimeout(1200)
  await nav.getByRole('button', { name: 'Demo shopper' }).click()
  await nav.waitForTimeout(2500)
  check('and signing in returns you there', nav.url().includes('category=furniture'), nav.url())
  await context.close()
}

section('More from a category')
{
  const { context, page: nav } = await freshPage(browser)
  await nav.goto(`${BASE}/products/ash-glaze-dinner-plate`, { waitUntil: 'networkidle' })
  const rail = nav.locator('ul:has(> li a[href^="/products/"])').last()
  check('the rail offers more than a single row', (await rail.locator('li').count()) > 4)

  const forward = nav.getByRole('button', { name: 'More products' })
  check('an arrow is offered when there is overflow', (await forward.count()) === 1)
  const before = await rail.evaluate((element) => element.scrollLeft)
  await forward.click()
  await nav.waitForTimeout(900)
  const after = await rail.evaluate((element) => element.scrollLeft)
  check('and it pages the rail along', after > before, `scrollLeft ${before} to ${after}`)
  await context.close()
}

section('Quick actions on the grid')
{
  const { context, page: shop } = await freshPage(browser)
  const badge = () => shop.locator('button[aria-label="Open cart"] span').first()

  await shop.goto(`${BASE}/shop?category=furniture`, { waitUntil: 'networkidle' })
  const card = shop.locator('article').first()
  const name = await card.locator('h3').innerText()

  // The buttons exist in the DOM at all times; only their opacity is hovered. A touch
  // device never fires hover, so they must be clickable without it.
  const add = card.locator('button[aria-label^="Add"]')
  check('every tile carries a quick add', (await add.count()) === 1)
  check(
    'and a favorite toggle',
    (await card.locator('button[aria-label^="Save"], button[aria-label^="Remove"]').count()) === 1,
  )

  await add.click()
  await shop.waitForTimeout(2000)
  check('quick add puts it in the cart', (await badge().innerText()) === '1', name)

  // Signed out, favouriting should invite a login rather than fail silently.
  await card.locator('button[aria-label^="Save"]').click()
  await shop.waitForTimeout(1200)
  check('favouriting signed out asks for a login', /Log in to save/.test(await visibleText(shop)))
  await context.close()
}

section('Favorites, signed in')
{
  const { context, page: shop } = await freshPage(browser)
  await signInAsDemo(shop, 'shopper')
  await shop.goto(`${BASE}/shop?category=vases`, { waitUntil: 'networkidle' })

  const card = shop.locator('article').first()
  const save = card.locator('button[aria-label^="Save"]')
  await save.click()
  await shop.waitForTimeout(1500)
  check('favouriting marks it saved', (await card.locator('button[aria-pressed="true"]').count()) === 1)

  await shop.reload({ waitUntil: 'networkidle' })
  const after = shop.locator('article').first()
  check('and it survives a reload', (await after.locator('button[aria-pressed="true"]').count()) === 1)

  // Leave the demo account as it was found.
  await after.locator('button[aria-label^="Remove"]').click()
  await shop.waitForTimeout(1500)
  check('unfavouriting undoes it', (await after.locator('button[aria-pressed="false"]').count()) === 1)
  await context.close()
}

section('Material and color filters')
{
  const { context, page: shop } = await freshPage(browser)
  const tiles = () => shop.locator('article').count()

  await shop.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })
  const all = await tiles()
  check('materials are checkboxes', (await shop.locator('input[type="checkbox"][name="material"]').count()) > 5)
  check('colors are swatches', (await shop.locator('input[type="checkbox"][name="color"]').count()) > 5)
  // Scoped to the material list: the price band labels contain digits quite legitimately.
  const materialList = await shop.locator('fieldset:has(legend:text-is("Material"))').innerText()
  check(
    'no counts beside the materials',
    !/\w\s+\d+/.test(materialList),
    materialList.replace(/\n/g, ' | ').slice(0, 80),
  )

  await shop.locator('input[name="material"][value="oak"]').check()
  await shop.waitForTimeout(1500)
  const oak = await tiles()
  check('checking a box filters the grid', oak > 0 && oak < all, `${all} to ${oak}`)
  check('and the URL carries it', shop.url().includes('material=oak'), shop.url())
  check('the box stays checked', await shop.locator('input[name="material"][value="oak"]').isChecked())

  await shop.locator('input[name="material"][value="ash"]').check()
  await shop.waitForTimeout(1500)
  // Overlap, not intersection: nothing is made of oak *and* ash.
  check('two materials returns either, not both', (await tiles()) > oak, `${await tiles()} tiles`)

  await shop.locator('input[name="material"][value="oak"]').uncheck()
  await shop.waitForTimeout(1500)
  check(
    'unchecking removes only that one',
    shop.url().includes('material=ash') && !shop.url().includes('oak'),
    shop.url(),
  )

  await shop.goto(`${BASE}/shop?color=blue`, { waitUntil: 'networkidle' })
  check('color filters too', (await tiles()) > 0 && (await tiles()) < all)

  await shop.goto(`${BASE}/shop?material=stoneware&color=cream`, { waitUntil: 'networkidle' })
  check('material and color combine', (await tiles()) > 0 && (await tiles()) < all, `${await tiles()} tiles`)

  await shop.goto(`${BASE}/shop?category=vases&material=stoneware`, { waitUntil: 'networkidle' })
  check('filtering keeps the category', shop.url().includes('category=vases'), shop.url())

  await shop.goto(`${BASE}/shop?material=bogus&color=nonsense`, { waitUntil: 'networkidle' })
  check('nonsense facets fall back rather than throwing', (await tiles()) === all, `${await tiles()} tiles`)

  // The quick actions overlay the whole tile, so it must not swallow the card's own link.
  await shop.goto(`${BASE}/shop?material=oak`, { waitUntil: 'networkidle' })
  const image = await shop.locator('article').first().locator('img').first().boundingBox()
  await shop.mouse.click(image.x + image.width / 2, image.y + image.height / 2)
  await shop.waitForTimeout(1800)
  check('clicking a tile image opens the product', shop.url().includes('/products/'), shop.url())
  await context.close()
}

section('Favoriting from the product page')
{
  const { context, page: reader } = await freshPage(browser)
  await signInAsDemo(reader, 'shopper')
  await reader.goto(`${BASE}/products/oak-wall-shelf`, { waitUntil: 'networkidle' })
  await reader.waitForTimeout(1200)

  const save = reader.locator('button[data-favorite="product"]')
  check('the product page carries its own save control', (await save.count()) === 1)
  const before = await save.getAttribute('aria-pressed')
  await save.click()
  await reader.waitForTimeout(1800)
  check('and it toggles', (await save.getAttribute('aria-pressed')) !== before)

  // Leave the demo account as it was found.
  await save.click()
  await reader.waitForTimeout(1500)
  check('toggling back leaves it as found', (await save.getAttribute('aria-pressed')) === before)
  await context.close()
}

section('Filtering does not reload or flood')
{
  const { context, page: shop } = await freshPage(browser)
  let requests = 0
  shop.on('request', (request) => {
    if (request.url().includes('/shop') && request.resourceType() !== 'image') requests++
  })

  await shop.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })
  await shop.waitForTimeout(600)
  requests = 0

  // Typing used to re-run its own effect on the render its navigation caused, which is a
  // loop. One debounced request for six keystrokes, and nothing at all once idle.
  await shop.locator('input[name="q"]').click()
  for (const letter of 'teapot') {
    await shop.keyboard.type(letter)
    await shop.waitForTimeout(80)
  }
  await shop.waitForTimeout(2500)
  const afterTyping = requests
  check('typing is debounced into one request', afterTyping <= 3, `${afterTyping} for six keystrokes`)

  await shop.waitForTimeout(3000)
  check('and stops once idle', requests === afterTyping, `${requests - afterTyping} more while idle`)

  // Scrolled to where the checkbox is on screen, so the click itself cannot scroll.
  await shop.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })
  await shop.waitForTimeout(600)
  const boxes = shop.locator('input[name="material"][value="stoneware"]')
  await boxes.scrollIntoViewIfNeeded()
  await shop.evaluate(() => window.scrollBy(0, 120))
  await shop.waitForTimeout(300)
  const before = await shop.evaluate(() => window.scrollY)

  await boxes.check()
  await shop.waitForTimeout(2200)
  const after = await shop.evaluate(() => window.scrollY)
  check('filtering keeps the scroll position', Math.abs(before - after) < 60, `${before} to ${after}`)
  check(
    'and does not reload the page',
    await shop.evaluate(() => performance.getEntriesByType('navigation').length === 1),
  )
  await context.close()
}

section('Price bands')
{
  const { context, page: shop } = await freshPage(browser)
  const tiles = () => shop.locator('article').count()

  await shop.goto(`${BASE}/shop`, { waitUntil: 'networkidle' })
  const all = await tiles()
  check('the four bands are offered', (await shop.locator('input[name="price"]').count()) === 4)

  await shop.goto(`${BASE}/shop?price=under-50`, { waitUntil: 'networkidle' })
  const cheap = await tiles()
  check('a band narrows the grid', cheap > 0 && cheap < all, `${cheap} of ${all}`)

  await shop.goto(`${BASE}/shop?price=under-50&price=over-200`, { waitUntil: 'networkidle' })
  check('two bands are a union', (await tiles()) > cheap, `${await tiles()} tiles`)

  await shop.goto(`${BASE}/shop?price=under-50&material=stoneware`, { waitUntil: 'networkidle' })
  check('price combines with material', (await tiles()) > 0 && (await tiles()) <= cheap)

  await shop.goto(`${BASE}/shop?price=bogus`, { waitUntil: 'networkidle' })
  check('a bogus band falls back rather than throwing', (await tiles()) === all)
  await context.close()
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
  await shop.locator('text=/Subtotal|Nothing in here yet/').first().waitFor({ timeout: 15000 })
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
    // The cart streams behind Suspense, so wait for it rather than for the network.
    await guest.locator('text=/Subtotal|Nothing in here yet/').first().waitFor({ timeout: 15000 })
    return visibleText(guest)
  }
  const emptyTheCart = async () => {
    await guest.goto(`${BASE}/cart`, { waitUntil: 'networkidle' })
    await guest.locator('text=/Subtotal|Nothing in here yet/').first().waitFor({ timeout: 15000 })
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

section('Checkout')
{
  const { context, page: buyer } = await freshPage(browser)

  await buyer.goto(`${BASE}/checkout`, { waitUntil: 'networkidle' })
  check('checkout needs a login', buyer.url().includes('/login'), buyer.url())

  await signInAsDemo(buyer, 'shopper')

  // The demo account persists between runs, so start from a known cart.
  const emptyTheCart = async () => {
    await buyer.goto(`${BASE}/cart`, { waitUntil: 'networkidle' })
    await buyer.locator('text=/Subtotal|Nothing in here yet/').first().waitFor({ timeout: 15000 })
    for (let line = 0; line < 20; line++) {
      const remove = buyer.getByRole('button', { name: 'Remove', exact: true }).first()
      if ((await remove.count()) === 0) break
      await remove.click()
      await buyer.waitForTimeout(900)
    }
  }
  await emptyTheCart()

  await buyer.goto(`${BASE}/checkout`, { waitUntil: 'networkidle' })
  check('an empty cart has nothing to pay for', /Nothing to pay for/.test(await visibleText(buyer)))

  await buyer.goto(`${BASE}/products/ash-dining-table`, { waitUntil: 'networkidle' })
  await buyer.getByRole('button', { name: 'Add to cart' }).click()
  await buyer.waitForTimeout(2000)
  await buyer.keyboard.press('Escape')
  await buyer.goto(`${BASE}/checkout`, { waitUntil: 'networkidle' })
  const summary = await visibleText(buyer)
  check('the cart is summarised before paying', /Ash Dining Table/.test(summary))

  // CI has no Stripe key, so the handover is checked only where one is configured. The
  // order still has to be created either way, which is the part that is ours.
  const payable = !/not configured/.test(summary)
  if (payable) {
    check('the test card is offered, so nobody uses a real one', /4242 4242 4242 4242/.test(summary))
    // Stripe's own page is somebody else's to break, so the suite stops at the handover.
    await buyer.getByRole('button', { name: /^Pay / }).click()
    await buyer.waitForURL(/checkout\.stripe\.com/, { timeout: 30000 }).catch(() => {})
    check('paying hands over to Stripe', buyer.url().includes('checkout.stripe.com'), buyer.url())
  } else {
    check('checkout says so plainly when Stripe is not configured', /not configured/.test(summary))
  }

  await buyer.goto(`${BASE}/account/orders`, { waitUntil: 'networkidle' })
  const orders = await visibleText(buyer)
  let orderUrl = null
  if (payable) {
    check('the order is recorded as awaiting payment', /Awaiting payment/.test(orders), orders.slice(0, 120))
    await buyer.locator('a[href^="/account/orders/"]').first().click()
    await buyer.waitForTimeout(1500)
    orderUrl = buyer.url()
    check('and it opens', /Ash Dining Table/.test(await visibleText(buyer)))
    // Nothing marked it paid, so the page must not pretend otherwise.
    check('an unpaid order is not called confirmed', !/confirmed/i.test(await visibleText(buyer)))
  }

  await emptyTheCart()
  check('the demo cart is left as it was found', /Nothing in here yet/.test(await visibleText(buyer)))
  await context.close()

  if (orderUrl) {
    const { context: nosy, page: other } = await freshPage(browser)
    await signInAsDemo(other, 'admin')
    await other.goto(orderUrl, { waitUntil: 'networkidle' })
    check("another account cannot open somebody else's order", !/Ash Dining Table/.test(await visibleText(other)))
    await nosy.close()
  }
}

section('Reviews')
{
  const { context, page: reader } = await freshPage(browser)

  await reader.goto(`${BASE}/products/oak-wall-shelf`, { waitUntil: 'networkidle' })
  await reader.locator('#reviews').scrollIntoViewIfNeeded()
  await reader.waitForTimeout(1200)
  const section = await reader.locator('#reviews').innerText()
  check('a reviewed product shows its reviews', /Marta Ellison|Joseph Ndiaye|Priya Raman/.test(section))
  check('and a rating beside the price', (await reader.locator('a[href="#reviews"]').count()) === 1)

  check('a signed-out visitor is asked to log in', /Log in/.test(section), section.slice(-120))
  await context.close()
}

section('Writing a review')
{
  const { context, page: author } = await freshPage(browser)
  await signInAsDemo(author, 'shopper')
  await author.goto(`${BASE}/products/harvest-vase`, { waitUntil: 'networkidle' })
  await author.locator('#reviews').scrollIntoViewIfNeeded()
  await author.waitForTimeout(1200)

  const words = `Sturdier than it looks, run ${Date.now()}`
  await author.getByRole('button', { name: '4 stars' }).click()
  await author.fill('textarea[name="body"]', words)
  await author.getByRole('button', { name: /Post review|Update your review/ }).click()
  await author.waitForTimeout(2500)

  await author.reload({ waitUntil: 'networkidle' })
  await author.locator('#reviews').scrollIntoViewIfNeeded()
  await author.waitForTimeout(1200)
  check('the review appears', (await author.locator('#reviews').innerText()).includes(words))
  check('and the form offers to update it', /Update your review/.test(await author.locator('#reviews').innerText()))

  // A second submission edits rather than duplicating, because of the primary key.
  const revised = `Edited, run ${Date.now()}`
  await author.fill('textarea[name="body"]', revised)
  await author.getByRole('button', { name: 'Update your review' }).click()
  await author.waitForTimeout(2500)
  await author.reload({ waitUntil: 'networkidle' })
  await author.locator('#reviews').scrollIntoViewIfNeeded()
  await author.waitForTimeout(1200)
  const after = await author.locator('#reviews').innerText()
  check('editing replaces rather than duplicates', after.includes(revised) && !after.includes(words))
  await context.close()
}

section('The account area')
{
  const { context, page: account } = await freshPage(browser)
  await signInAsDemo(account, 'shopper')

  await account.goto(`${BASE}/account/favorites`, { waitUntil: 'networkidle' })
  await account.waitForTimeout(1200)
  check('favorites has its own page', /Favorites/.test(await visibleText(account)))
  const sidebar = await account.locator('nav[aria-label="Account"]').innerText()
  check(
    'the sidebar reaches orders, favorites and settings',
    /Orders/.test(sidebar) && /Favorites/.test(sidebar) && /Settings/.test(sidebar),
    sidebar.replace(/\n/g, ' | '),
  )

  // Save something, then confirm it is listed there.
  await account.goto(`${BASE}/shop?category=lighting`, { waitUntil: 'networkidle' })
  const card = account.locator('article').first()
  const name = await card.locator('h3').innerText()
  await card.locator('button[aria-label^="Save"]').click()
  await account.waitForTimeout(1500)

  await account.goto(`${BASE}/account/favorites`, { waitUntil: 'networkidle' })
  await account.waitForTimeout(1200)
  check('a saved product is listed there', (await visibleText(account)).includes(name), name)

  // Leave the demo account as it was found.
  await account.locator('button[aria-label^="Remove"]').first().click()
  await account.waitForTimeout(1500)
  await context.close()
}

section('Sale prices')
{
  const { context, page: shopper } = await freshPage(browser)

  await shopper.goto(`${BASE}/products/harvest-vase`, { waitUntil: 'networkidle' })
  const page = await visibleText(shopper)
  // Seeded at 25% off, so the sale price shows beside the struck-through original.
  check('a sale product shows both prices', /\$58\.50/.test(page) && /\$78\.00/.test(page), page.slice(0, 120))

  await shopper.getByRole('button', { name: 'Add to cart' }).click()
  await shopper.waitForTimeout(2000)
  const sheet = await shopper.locator('[role="dialog"]').innerText()
  // The important one: the cart has to charge the sale price, not the list price.
  check(
    'and the cart charges the sale price',
    /58\.50/.test(sheet) && !/78\.00/.test(sheet),
    sheet.replace(/\n/g, ' | ').slice(0, 140),
  )

  await shopper.goto(`${BASE}/shop?category=vases`, { waitUntil: 'networkidle' })
  check('the grid marks it as on sale', /% off/.test(await visibleText(shopper)))
  await context.close()
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
