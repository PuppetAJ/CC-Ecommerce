'use client'

import { HeartIcon, ShoppingBagIcon } from 'lucide-react'
import { Pop } from '@/components/motion'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { quickAdd } from '@/features/cart/quick-add'
import { toggle } from '@/features/favorites/actions'

// Revealed on hover only where there is a mouse. Touch has no hover and coarse pointers
// need the 44px target, so there the buttons simply stay visible; focus-within covers the
// keyboard. Research on this pattern is in docs/REDESIGN.md §15.
// pointer-events-none, or this covers the whole tile and swallows clicks meant for the
// card's link; the buttons themselves opt back in.
const shell =
  'pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-3 transition-opacity ' +
  'pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-within:opacity-100 ' +
  'motion-reduce:transition-none'

const button =
  'pointer-events-auto inline-flex size-11 items-center justify-center rounded-full bg-white/95 text-olive-950 shadow-sm ' +
  'transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ' +
  'disabled:opacity-60 dark:bg-olive-950/90 dark:text-white dark:hover:bg-olive-950'

export function QuickActions({
  productId,
  name,
  soldOut,
  favorited,
}: {
  productId: number
  name: string
  soldOut: boolean
  favorited: boolean
}) {
  const [isFavorite, setIsFavorite] = useState(favorited)
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

  function favorite() {
    start(async () => {
      const previous = isFavorite
      setIsFavorite(!previous)
      const result = await toggle(productId)
      if (result.needsLogin || result.error) {
        setIsFavorite(previous)
        toast.error(result.needsLogin ? 'Log in to save favorites' : result.error!)
        return
      }
      setIsFavorite(Boolean(result.favorited))
      // The favorites page is a list of exactly these, so removing one has to drop the tile.
      router.refresh()
    })
  }

  return (
    <div className={shell}>
      <button
        type="button"
        onClick={favorite}
        disabled={pending}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? `Remove ${name} from your favorites` : `Save ${name} to your favorites`}
        className={button}
      >
        <Pop on={isFavorite} className="inline-flex">
          <HeartIcon className={isFavorite ? 'size-5 fill-current' : 'size-5'} />
        </Pop>
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
