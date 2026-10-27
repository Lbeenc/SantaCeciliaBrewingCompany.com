import type { LogEntry } from '../api'
import { pad2, shortDate } from '../format'

export function Logbook({ entries }: { entries: LogEntry[] }) {
  return (
    <section id="log" className="wrap section">
      <div className="section-head">
        <div>
          <div className="eyebrow">05 — Brew notes</div>
          <h2 className="display h-section">Logbook</h2>
        </div>
      </div>
      {entries.length === 0 ? (
        <p className="stage-empty">No entries yet.</p>
      ) : (
        <ul className="log-grid">
          {entries.map(e => (
            <li key={e.number}>
              <article className="log-card">
                <div className="log-top mono-sm">
                  <span>Entry {pad2(e.number)}</span>
                  <time dateTime={e.date}>{shortDate(e.date)}</time>
                </div>
                <div className="log-body">
                  <span className="mono-sm">{e.tag}</span>
                  <h3 className="cond" style={{ margin: 0 }}>{e.title}</h3>
                  <p>{e.excerpt}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
