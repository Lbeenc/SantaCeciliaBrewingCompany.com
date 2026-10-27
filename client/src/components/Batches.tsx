import type { Batch, BatchStage } from '../api'
import { abv, pad2, shortDate } from '../format'

const STAGES: { stage: BatchStage; title: string; bar: string; empty: string }[] = [
  { stage: 'fermenting', title: 'Fermenting', bar: 'var(--rust)', empty: 'Nothing in the fermenter.' },
  { stage: 'conditioning', title: 'Conditioning', bar: 'var(--kraft)', empty: 'Nothing conditioning.' },
  { stage: 'ready', title: 'Ready', bar: 'var(--ink)', empty: 'Nothing ready yet.' },
  { stage: 'planned', title: 'Planned', bar: '#8A857A', empty: 'Next recipe TBD.' },
]

function when(b: Batch): string {
  switch (b.stage) {
    case 'fermenting': return `Brewed ${shortDate(b.brewedOn)}`
    case 'conditioning': return `Packaged ${shortDate(b.packagedOn)}`
    case 'ready': return `Since ${shortDate(b.packagedOn)}`
    case 'planned': return `Brew day ${shortDate(b.plannedFor)}`
    default: return ''
  }
}

export function Batches({ batches }: { batches: Batch[] }) {
  return (
    <section id="batches" className="wrap section">
      <div className="section-head">
        <div>
          <div className="eyebrow">01 — In progress</div>
          <h2 className="display h-section">Current Batches</h2>
        </div>
      </div>
      <div className="stages">
        {STAGES.map(s => {
          const items = batches.filter(b => b.stage === s.stage)
          return (
            <div key={s.stage} className="stage" style={{ borderTopColor: s.bar }}>
              <div className="stage-head">
                <h3 className="display">{s.title}</h3>
                <span className="mono-sm" style={{ color: 'var(--muted)' }}>{pad2(items.length)}</span>
              </div>
              {items.length === 0 ? (
                <div className="stage-empty">{s.empty}</div>
              ) : (
                <ul className="stage-list">
                  {items.map(b => (
                    <li key={b.number} className="batch-card">
                      <div className="batch-meta mono-sm">
                        <span>Batch #{pad2(b.number)}</span>
                        <span>{when(b)}</span>
                      </div>
                      <div className="batch-title">
                        <span className="glass" style={{ background: b.color }} aria-hidden="true" />
                        <span className="cond">{b.name}</span>
                      </div>
                      <div className="batch-sub">{b.style} · {abv(b.abv)}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
