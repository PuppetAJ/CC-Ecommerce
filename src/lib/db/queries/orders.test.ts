import assert from 'node:assert/strict'
import { after, beforeEach, describe, it } from 'node:test'
import { pool } from '../pool.ts'
import { insertProduct, resetDatabase } from '../test-support.ts'
import { addCartItem, createCart, getCartItems } from './cart.ts'
import { attachStripeSession, createPendingOrder, listOrdersForUser, markOrderPaid } from './orders.ts'

after(() => pool.end())
beforeEach(resetDatabase)

const stock = async (id: number) => {
  const { rows } = await pool.query<{ stock_quantity: number }>('SELECT stock_quantity FROM products WHERE id = $1', [
    id,
  ])
  return rows[0].stock_quantity
}

describe('order creation', () => {
  it('prices the order from the products table, not the caller', async () => {
    const cart = await createCart()
    const product = await insertProduct({ price_cents: 2800, stock_quantity: 5 })
    await addCartItem(cart, product, 2)

    const order = await createPendingOrder('user-1', cart)
    assert.equal(order.total_cents, 5600)
    assert.equal(order.items[0].unit_price_cents, 2800)
    assert.equal(order.status, 'pending')
  })

  it('copies the product name so a later rename does not rewrite history', async () => {
    const cart = await createCart()
    const product = await insertProduct({ name: 'Original Name' })
    await addCartItem(cart, product, 1)
    const order = await createPendingOrder('user-1', cart)

    await pool.query('UPDATE products SET name = $1 WHERE id = $2', ['Renamed', product])

    const [stored] = await listOrdersForUser('user-1')
    assert.equal(stored.items[0].product_name, 'Original Name')
    assert.equal(stored.id, order.id)
  })

  it('refuses an empty cart', async () => {
    const cart = await createCart()
    await assert.rejects(() => createPendingOrder('user-1', cart), /Cart is empty/)
  })

  it('writes nothing when it throws', async () => {
    const cart = await createCart()
    await assert.rejects(() => createPendingOrder('user-1', cart))
    const { rows } = await pool.query('SELECT 1 FROM orders')
    assert.equal(rows.length, 0, 'the transaction rolled back')
  })
})

describe('marking an order paid', () => {
  const paidOrder = async () => {
    const cart = await createCart()
    const product = await insertProduct({ price_cents: 1000, stock_quantity: 10 })
    await addCartItem(cart, product, 3)
    const order = await createPendingOrder('user-1', cart)
    await attachStripeSession(order.id, 'cs_test_123')
    return { cart, product, order }
  }

  it('decrements stock and empties the cart', async () => {
    const { cart, product } = await paidOrder()
    await pool.query('UPDATE carts SET user_id = $1 WHERE id = $2', ['user-1', cart])

    assert.equal(await markOrderPaid('cs_test_123'), true)
    assert.equal(await stock(product), 7)
    assert.deepEqual(await getCartItems(cart), [])

    const [order] = await listOrdersForUser('user-1')
    assert.equal(order.status, 'paid')
    assert.notEqual(order.paid_at, null)
  })

  it('is idempotent, so a replayed webhook cannot decrement stock twice', async () => {
    const { product } = await paidOrder()

    assert.equal(await markOrderPaid('cs_test_123'), true)
    assert.equal(await markOrderPaid('cs_test_123'), false, 'second call is a no-op')
    assert.equal(await stock(product), 7, 'stock was decremented once')
  })

  it('ignores an unknown session id', async () => {
    assert.equal(await markOrderPaid('cs_test_never_seen'), false)
  })
})

describe('listing orders', () => {
  it('returns each order with its items in one query', async () => {
    for (const n of [1, 2]) {
      const cart = await createCart()
      const product = await insertProduct({ name: `Item ${n}`, stock_quantity: 5 })
      await addCartItem(cart, product, n)
      await createPendingOrder('user-1', cart)
    }

    const orders = await listOrdersForUser('user-1')
    assert.equal(orders.length, 2)
    assert.ok(orders.every((o) => o.items.length === 1))
  })

  it('does not return another user\'s orders', async () => {
    const cart = await createCart()
    await addCartItem(cart, await insertProduct(), 1)
    await createPendingOrder('user-1', cart)

    assert.deepEqual(await listOrdersForUser('user-2'), [])
  })
})
