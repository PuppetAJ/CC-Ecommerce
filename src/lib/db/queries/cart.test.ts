import assert from 'node:assert/strict'
import { after, beforeEach, describe, it } from 'node:test'
import { pool } from '../pool.ts'
import { insertProduct, insertUser, resetDatabase } from '../test-support.ts'
import { addCartItem, createCart, getCartItems, mergeGuestCart, setCartItemQuantity } from './cart.ts'

after(() => pool.end())
beforeEach(async () => {
  await resetDatabase()
  await insertUser('user-1')
  await insertUser('user-2')
})

describe('cart queries', () => {
  it('adds to the existing quantity instead of failing on a duplicate', async () => {
    const cart = await createCart()
    const product = await insertProduct({ stock_quantity: 10 })

    await addCartItem(cart, product, 2)
    await addCartItem(cart, product, 3)

    const items = await getCartItems(cart)
    assert.equal(items.length, 1, 'one row, not a primary key violation')
    assert.equal(items[0].quantity, 5)
  })

  it('never lets quantity exceed stock', async () => {
    const cart = await createCart()
    const product = await insertProduct({ stock_quantity: 3 })

    await addCartItem(cart, product, 99)
    assert.equal((await getCartItems(cart))[0].quantity, 3)

    await setCartItemQuantity(cart, product, 50)
    assert.equal((await getCartItems(cart))[0].quantity, 3)
  })

  it('ignores an out of stock product', async () => {
    const cart = await createCart()
    const product = await insertProduct({ stock_quantity: 0 })

    await addCartItem(cart, product, 1)
    assert.deepEqual(await getCartItems(cart), [])
  })

  it('removes the row when quantity is set to zero', async () => {
    const cart = await createCart()
    const product = await insertProduct()

    await addCartItem(cart, product, 2)
    await setCartItemQuantity(cart, product, 0)
    assert.deepEqual(await getCartItems(cart), [])
  })

  it('claims a guest cart when the user has none', async () => {
    const guest = await createCart()
    const product = await insertProduct()
    await addCartItem(guest, product, 2)

    const cartId = await mergeGuestCart(guest, 'user-1')
    assert.equal(cartId, guest, 'the same cart is reused')
    assert.equal((await getCartItems(cartId))[0].quantity, 2)
  })

  it('folds a guest cart into an existing user cart', async () => {
    const product = await insertProduct({ stock_quantity: 10 })
    const userCart = await createCart()
    await pool.query('UPDATE carts SET user_id = $1 WHERE id = $2', ['user-2', userCart])
    await addCartItem(userCart, product, 1)

    const guest = await createCart()
    await addCartItem(guest, product, 2)

    const merged = await mergeGuestCart(guest, 'user-2')
    assert.equal(merged, userCart)
    assert.equal((await getCartItems(merged))[0].quantity, 3, 'quantities add up')

    const { rows } = await pool.query('SELECT 1 FROM carts WHERE id = $1', [guest])
    assert.equal(rows.length, 0, 'the guest cart is gone')
  })
})
