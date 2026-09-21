'use client'

import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/elements/button'
import type { Product } from '@/lib/db/types'
import { saveProduct, type AdminState } from '../actions'

const field =
  'w-full rounded-lg border border-olive-300 bg-transparent px-3 py-2 text-sm text-olive-950 focus:ring-2 focus:ring-ring focus:outline-none dark:border-olive-800 dark:text-white'

export function ProductForm({ product }: { product: Product }) {
  const [state, action, pending] = useActionState<AdminState, FormData>(saveProduct, undefined)

  useEffect(() => {
    if (state?.savedAt) toast.success('Saved to the storefront')
    if (state?.error) toast.error(state.error)
  }, [state])

  // Cents in the database, dollars in the form: nobody types 12800 for $128.
  const dollars = (cents: number | null) => (cents === null ? '' : (cents / 100).toFixed(2))

  return (
    <form action={action} className="flex max-w-lg flex-col gap-5">
      <input type="hidden" name="id" value={product.id} />

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-olive-950 dark:text-white">Price</span>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          required
          defaultValue={dollars(product.price_cents)}
          className={field}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-olive-950 dark:text-white">Sale price</span>
        <input
          name="salePrice"
          type="number"
          step="0.01"
          min="0"
          placeholder="Leave empty for no sale"
          defaultValue={dollars(product.sale_price_cents)}
          className={field}
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-olive-950 dark:text-white">Stock</span>
        <input
          name="stock"
          type="number"
          min="0"
          step="1"
          required
          defaultValue={product.stock_quantity}
          className={field}
        />
      </label>

      <label className="flex items-center gap-2.5">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={product.is_featured}
          className="size-4 rounded-sm border-olive-400 accent-olive-900 dark:border-olive-600 dark:accent-olive-300"
        />
        <span className="text-sm text-olive-950 dark:text-white">Show on the landing page</span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
        {/* An order references its products, so a delete would break other people's history. */}
        <p className="text-xs text-olive-600 dark:text-olive-400">Deleting products is disabled on the demo.</p>
      </div>
    </form>
  )
}
