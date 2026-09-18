import assert from 'node:assert/strict'
import { after, beforeEach, describe, it } from 'node:test'
import { pool } from '../pool.ts'
import { insertProduct, resetDatabase } from '../test-support.ts'
import { getProductBySlug, listFeaturedProducts, listProducts } from './products.ts'

after(() => pool.end())
beforeEach(resetDatabase)

describe('product queries', () => {
  it('filters by category', async () => {
    await insertProduct({ category: 'vases', name: 'A Vase' })
    await insertProduct({ category: 'furniture', name: 'A Chair' })

    const vases = await listProducts({ category: 'vases' })
    assert.equal(vases.length, 1)
    assert.equal(vases[0].name, 'A Vase')
  })

  it('searches name and description', async () => {
    await insertProduct({ name: 'Ridge Mug', description: 'Thrown by hand.' })
    await insertProduct({ name: 'Plate', description: 'Glazed with ash.' })

    assert.equal((await listProducts({ search: 'ridge' })).length, 1, 'matches name, case-insensitively')
    assert.equal((await listProducts({ search: 'ash' })).length, 1, 'matches description')
    assert.equal((await listProducts({ search: 'nothing' })).length, 0)
  })

  it('sorts by price in both directions', async () => {
    await insertProduct({ price_cents: 500, name: 'Cheap' })
    await insertProduct({ price_cents: 9000, name: 'Dear' })

    assert.equal((await listProducts({ sort: 'price-asc' }))[0].name, 'Cheap')
    assert.equal((await listProducts({ sort: 'price-desc' }))[0].name, 'Dear')
  })

  it('returns null rather than throwing for an unknown slug', async () => {
    assert.equal(await getProductBySlug('does-not-exist'), null)
  })

  it('returns only featured products', async () => {
    await insertProduct({ is_featured: true, name: 'Featured' })
    await insertProduct({ is_featured: false })

    const featured = await listFeaturedProducts()
    assert.equal(featured.length, 1)
    assert.equal(featured[0].name, 'Featured')
  })

  it('reads prices back as numbers, not strings', async () => {
    await insertProduct({ price_cents: 2800 })
    const [product] = await listProducts()
    assert.equal(typeof product.price_cents, 'number')
    assert.equal(product.price_cents, 2800)
  })
})
