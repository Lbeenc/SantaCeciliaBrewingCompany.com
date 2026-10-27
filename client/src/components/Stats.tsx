import type { SiteSummary } from '../api'
import { orTbd } from '../format'

export function Stats({ summary }: { summary?: SiteSummary }) {
  const site = summary?.site
  const items: [string, string][] = [
    ['Batch size', orTbd(site?.batchSizeGallons, ' gal')],
    ['Batches brewed', orTbd(summary?.batchesBrewed)],
    ['Styles tried', orTbd(summary?.stylesTried)],
    ['Brewing since', orTbd(site?.brewingSince)],
  ]

  return (
    <section aria-label="By the numbers" className="wrap">
      <div className="photo stats-photo">
        <span className="photo-tag">Photo · a brew day at home</span>
      </div>
      <dl className="stats">
        {items.map(([label, value]) => (
          <div key={label}>
            <dt className="mono-sm">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
