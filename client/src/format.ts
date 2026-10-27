const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Parses "YYYY-MM-DD" (or "YYYY-MM") without time-zone shifts. */
function parts(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m, d }
}

export function shortDate(iso: string | null, fallback = 'TBA'): string {
  if (!iso) return fallback
  const { y, m, d } = parts(iso)
  return `${MONTHS[m - 1]} ${d}, ${y}`
}

export function monthName(isoMonth: string): string {
  return MONTHS[parts(isoMonth).m - 1]
}

export function weekday(iso: string): string {
  const { y, m, d } = parts(iso)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long' })
}

export const abv = (v: number | null) => (v == null ? 'ABV TBD' : `${v.toFixed(1)}%`)
export const pad2 = (n: number) => String(n).padStart(2, '0')
export const orTbd = (v: string | number | null | undefined, suffix = '') =>
  v == null || v === '' ? 'TBD' : `${v}${suffix}`
