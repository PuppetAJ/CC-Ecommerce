/** Not about injection: a bound null byte still fails the request, and `%` and `_` are pattern syntax. */

/** Postgres has no representation for a null byte in text, so it throws rather than store one. */
export function withoutNulls(value: string): string {
  return value.replaceAll('\u0000', '')
}

/** What somebody typed, as a literal to look for rather than a pattern to match. */
export function searchTerm(value: string): string {
  return withoutNulls(value).replace(/[\\%_]/g, (character) => `\\${character}`)
}
