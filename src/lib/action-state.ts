type Result = { error?: string; ok?: number }

/** `ok` is a timestamp rather than a boolean, so a second success is distinguishable from the first. */
export type ActionState<Extra = unknown> = (Result & Extra) | undefined

export function succeeded(): { ok: number } {
  return { ok: Date.now() }
}
