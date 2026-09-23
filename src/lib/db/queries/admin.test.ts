import assert from 'node:assert/strict'
import { after, beforeEach, describe, it } from 'node:test'
import { pool } from '../pool.ts'
import { insertProduct, insertUser, resetDatabase } from '../test-support.ts'
import { listAdminOrders } from './admin.ts'
import { addCartItem, createCart } from './cart.ts'
import { createPendingOrder } from './orders.ts'

after(() => pool.end())
beforeEach(async () => {
  await resetDatabase()
  await insertUser('user-1')
})

async function order(priceCents: number, quantity = 1) {
  const cart = await createCart()
  await addCartItem(cart, await insertProduct({ price_cents: priceCents, stock_quantity: 50 }), quantity)
  return createPendingOrder('user-1', cart)
}

describe('admin order listing', () => {
  it('sorts by whichever column is asked for, in either direction', async () => {
    await order(1000, 3)
    await order(5000, 1)
    await order(3000, 2)

    const byTotal = (await listAdminOrders({ sort: 'total', dir: 'asc' })).rows.map((o) => o.total_cents)
    assert.deepEqual(byTotal, [3000, 5000, 6000])

    const byItems = (await listAdminOrders({ sort: 'items', dir: 'desc' })).rows.map((o) =>
      o.items.reduce((n, item) => n + item.quantity, 0),
    )
    assert.deepEqual(byItems, [3, 2, 1])

    const byId = (await listAdminOrders({ sort: 'order', dir: 'asc' })).rows.map((o) => o.id)
    assert.deepEqual(
      byId,
      [...byId].sort((a, b) => a - b),
    )
  })

  it('lists newest first when nothing is asked for', async () => {
    const first = await order(1000)
    const second = await order(2000)
    const ids = (await listAdminOrders()).rows.map((o) => o.id)
    assert.deepEqual(ids, [second.id, first.id])
  })
})
