'use server'

import { z } from 'zod'
import { getSession } from '@/lib/auth/session'
import { toggleFavorite } from '@/lib/db/queries/favorites'

const target = z.object({ productId: z.coerce.number().int().positive() })

export type FavoriteState = { favorited?: boolean; error?: string; needsLogin?: boolean }

export async function toggle(productId: number): Promise<FavoriteState> {
  // Not requireUser: a signed-out visitor gets an invitation, not a redirect out of the grid.
  const session = await getSession()
  if (!session) return { needsLogin: true }

  const parsed = target.safeParse({ productId })
  if (!parsed.success) return { error: 'That product could not be saved.' }

  return { favorited: await toggleFavorite(session.user.id, parsed.data.productId) }
}
