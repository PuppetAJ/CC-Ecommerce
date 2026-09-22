import 'server-only'

export const perPage = 20

export type Page<T> = { rows: T[]; total: number }

// count(*) OVER () rides along with the page, so the total is one round trip rather than two.
export const withTotal = 'count(*) OVER () AS total_rows'

export function paged<T>(rows: (T & { total_rows?: string })[]): Page<T> {
  return { rows: rows as T[], total: Number(rows[0]?.total_rows ?? 0) }
}
