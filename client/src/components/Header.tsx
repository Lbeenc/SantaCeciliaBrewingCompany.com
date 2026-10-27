import { useState } from 'react'
import type { EventView } from '../api'
import { monthName, shortDate } from '../format'
import { Logo } from './Logo'

const LINKS = [
  ['#batches', 'Batches'],
  ['#events', 'Events'],
  ['#brewday', 'Brew Day'],
  ['#brewer', 'The Brewer'],
  ['#log', 'Logbook'],
] as const

export function Header({ nextEvent }: { nextEvent?: EventView }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      {nextEvent && <Announcement view={nextEvent} />}
      <header className="site-header">
        <div className="wrap header-inner">
          <a href="#top" className="brand">
            <Logo height={54} />
            <span className="brand-name">
              Santa Cecilia
              <span className="brand-sub">Brewing Co.</span>
            </span>
          </a>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-controls="main-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(o => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <nav id="main-nav" aria-label="Main" className={`nav ${open ? 'open' : ''}`}>
            {LINKS.map(([href, label]) => (
              <a key={href} href={href} onClick={close}>{label}</a>
            ))}
            <a href="#alerts" className="btn btn-solid" onClick={close}>Batch alerts</a>
          </nav>
        </div>
      </header>
    </>
  )
}

function Announcement({ view }: { view: EventView }) {
  const e = view.event
  const when = e.date ? shortDate(e.date) : `${monthName(e.month)} ${e.month.slice(0, 4)}`
  return (
    <a href="#events" className="announce">
      <span className="wrap announce-inner mono">
        <span>On tap at {e.name} · {when}{e.venue ? ` · ${e.venue}` : ''}</span>
        <span className="announce-cta">Event details →</span>
      </span>
    </a>
  )
}
