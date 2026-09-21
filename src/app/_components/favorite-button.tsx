'use client'

import { HeartIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Pop } from '@/components/motion'
import { toggle } from '@/features/favorites/actions'

/** The product page's own save control, beside Add to cart rather than over a tile. */
export function FavoriteButton({
  productId,
  name,
  favorited,
}: {
  productId: number
  name: string
  favorited: boolean
}) {
  const [isFavorite, setIsFavorite] = useState(favorited)
  const [pending, start] = useTransition()
  const router = useRouter()

  function save() {
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
      router.refresh()
    })
  }

  return (
    <button
      type="button"
      onClick={save}
      disabled={pending}
      aria-pressed={isFavorite}
      data-favorite="product"
      aria-label={isFavorite ? `Remove ${name} from your favorites` : `Save ${name} to your favorites`}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-olive-950/15 text-olive-700 transition-colors hover:bg-olive-950/5 disabled:opacity-60 dark:border-white/20 dark:text-olive-300 dark:hover:bg-white/10"
    >
      <Pop on={isFavorite} className="inline-flex">
        <HeartIcon className={isFavorite ? 'size-5 fill-current' : 'size-5'} />
      </Pop>
    </button>
  )
}
