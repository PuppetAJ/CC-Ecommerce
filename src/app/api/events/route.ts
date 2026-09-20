import { recordEvent } from '@/lib/db/queries/events'
import { consume } from '@/lib/db/queries/rate-limit'
import { trackedEvent } from '@/lib/analytics'

/**
 * A public write endpoint, so it is rate limited per session and answers 204 whatever
 * happens. A visitor's page is never made worse by a measurement failing.
 */
export async function POST(request: Request): Promise<Response> {
  const parsed = trackedEvent.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return new Response(null, { status: 204 })

  const { allowed } = await consume(`events:${parsed.data.session}`, { window: 60, max: 60 })
  if (!allowed) return new Response(null, { status: 204 })

  await recordEvent(parsed.data).catch(() => {})
  return new Response(null, { status: 204 })
}
