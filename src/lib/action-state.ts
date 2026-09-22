type Result = { error?: string; ok?: number }

/**
 * What every Server Action gives a form back, with `Extra` for the few that carry a flag as well.
 * `ok` is a fresh timestamp rather than a boolean, so a second success is distinguishable from
 * the first and the client can react to it again.
 */
export type ActionState<Extra = unknown> = (Result & Extra) | undefined

export function succeeded(): { ok: number } {
  return { ok: Date.now() }
}
