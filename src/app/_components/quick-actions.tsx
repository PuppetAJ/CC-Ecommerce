'use client'

import { HeartIcon, ShoppingBagIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { quickAdd } from '@/features/cart/quick-add'
import { toggle } from '@/features/favourites/actions'

// Revealed on hover only where there is a mouse. Touch has no hover and coarse pointers
// need the 44px target, so there the buttons simply stay visible; focus-within covers the
// keyboard. Research on this pattern is in docs/REDESIGN.md §15.
const shell =
  'absolute inset-x-2 bottom-2 z-10 flex items-center justify-between gap-2 transition-opacity ' +
  'pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100 ' +
  'motion-reduce:transition-none'

const button =
  'inline-flex size-11 items-center justify-center rounded-full bg-white/95 text-olive-950 shadow-sm ' +
  'transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ' +
  'disabled:opacity-60 dark:bg-olive-950/90 dark:text-white dark:hover:bg-olive-950'

export function QuickActions({
  productId,
  name,
  soldOut,
  favourited,
}: {
  productId: number
  name: string
  soldOut: boolean
  favourited: boolean
}) {
  const [isFavourite, setIsFavourite] = useState(favourited)
  const [pending, start] = useTransition()
  const router = useRouter()

  function add() {
    start(async () => {
      const result = await quickAdd(productId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`${name} added to your cart`)
      router.refresh()
    })
  }

  function favourite() {
    start(async () => {
      const previous = isFavourite
      setIsFavourite(!previous)
      const result = await toggle(productId)
      if (result.needsLogin || result.error) {
        setIsFavourite(previous)
        toast.error(result.needsLogin ? 'Log in to save favourites' : result.error!)
        return
      }
      setIsFavourite(Boolean(result.favourited))
    })
  }

  return (
    <div className={shell}>
      <button
        type="button"
        onClick={favourite}
        disabled={pending}
        aria-pressed={isFavourite}
        aria-label={isFavourite ? `Remove ${name} from your favourites` : `Save ${name} to your favourites`}
        className={button}
      >
        <HeartIcon className={isFavourite ? 'size-5 fill-current' : 'size-5'} />
      </button>
      {!soldOut && (
        <button
          type="button"
          onClick={add}
          disabled={pending}
          aria-label={`Add ${name} to your cart`}
          className={button}
        >
          <ShoppingBagIcon className="size-5" />
        </button>
      )}
    </div>
  )
}
