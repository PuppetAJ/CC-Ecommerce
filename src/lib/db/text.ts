/**
 * Text on its way into a query.
 *
 * Values are always bound, never spliced, so none of this is about injection. It is about two
 * things a bound value still gets wrong: Postgres rejects a null byte outright and the whole
 * request fails, and `%` and `_` are pattern syntax, so searching for one matched everything.
 */

/** Postgres has no representation for a null byte in text, so it throws rather than store one. */
export function withoutNulls(value: string): string {
  return value.replaceAll('\u0000', '')
}

/** What somebody typed, as a literal to look for rather than a pattern to match. */
export function searchTerm(value: string): string {
  return withoutNulls(value).replace(/[\\%_]/g, (character) => `\\${character}`)
}
