import type { Batch, EventView, SiteSummary } from '../api'
import { abv, shortDate } from '../format'
import { Logo } from './Logo'

interface HeroProps {
  summary?: SiteSummary
  ready: Batch[]
  nextEvent?: EventView
}

export function Hero({ summary, ready, nextEvent }: HeroProps) {
  const site = summary?.site
  const gallons = site?.batchSizeGallons ? `${site.batchSizeGallons}-gallon` : 'small'

  return (
    <section id="top" className="wrap hero">
      <div className="hero-copy">
        <div className="eyebrow">
          Home-brewed in {site?.town ?? '…'}
          {site?.brewingSince ? ` · Since ${site.brewingSince}` : ''}
        </div>
        <h1 className="display">The Santa Cecilia<br />Brewing Company</h1>
        <p className="hero-lede">
          {site?.brewerName ?? 'Our brewer'} brews {gallons} batches at home. The beer isn't sold — it's shared
          with friends and family, and now and then poured at events
          {nextEvent ? <> like {nextEvent.event.name}</> : null}. This is where you can see what's ready,
          where it's pouring next, and how each one was made.
        </p>
        <div className="btn-row">
          <a href="#batches" className="btn btn-solid">See all batches</a>
          <a href="#events" className="btn">Where to try it</a>
        </div>
      </div>

      <aside className="ready-board" aria-labelledby="ready-h">
        <Logo height={120} className="sticker" alt="The Santa Cecilia Brewing Company logo" />
        <div className="mono-sm" style={{ color: 'var(--kraft)' }}>
          Updated {shortDate(summary?.updatedOn ?? null, 'recently')}
        </div>
        <h2 id="ready-h" className="display">Ready to drink</h2>
        {ready.length > 0 ? (
          <ul className="ready-list">
            {ready.map(b => (
              <li key={b.number}>
                <span className="glass" style={{ background: b.color }} aria-hidden="true" />
                <span className="ready-name">
                  <span className="cond">{b.name}</span>
                  <span className="ready-style">{b.style}</span>
                </span>
                <span className="mono-sm">{abv(b.abv)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-note">Nothing ready right now — check back after the next brew day.</p>
        )}
        <div className="ready-foot mono-sm">
          <span>Next brew day</span>
          <strong>{shortDate(site?.nextBrewDay ?? null)}</strong>
        </div>
      </aside>
    </section>
  )
}
