'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { toggle } from './actions'

/** Flips straight away and puts it back if the server disagrees, so the heart never lags a click. */
export function useFavorite(productId: number, name: string, initial: boolean) {
  const [isFavorite, setIsFavorite] = useState(initial)
  const [pending, start] = useTransition()
  const router = useRouter()

  function save() {
    start(async () => {
      const previous = isFavorite
      setIsFavorite(!previous)
      const result = await toggle(productId)
      if (result?.needsLogin || result?.error) {
        setIsFavorite(previous)
        toast.error(result.needsLogin ? 'Log in to save favorites' : result.error!)
        return
      }
      setIsFavorite(Boolean(result?.favorited))
      // The favorites page is a list of exactly these, so removing one has to drop the tile.
      router.refresh()
    })
  }

  return {
    isFavorite,
    pending,
    save,
    label: isFavorite ? `Remove ${name} from your favorites` : `Save ${name} to your favorites`,
  }
}
