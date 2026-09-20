'use server'

import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { toggleFavourite } from '@/lib/db/queries/favourites'

const target = z.object({ productId: z.coerce.number().int().positive() })

export type FavouriteState = { favourited?: boolean; error?: string; needsLogin?: boolean }

export async function toggle(productId: number): Promise<FavouriteState> {
  // Not requireUser: a signed-out visitor gets an invitation, not a redirect out of the grid.
  const session = await getSession()
  if (!session) return { needsLogin: true }

  const parsed = target.safeParse({ productId })
  if (!parsed.success) return { error: 'That product could not be saved.' }

  return { favourited: await toggleFavourite(session.user.id, parsed.data.productId) }
}
