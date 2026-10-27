import type { ReactNode } from 'react'
import { api, type EventView, type EventsResponse } from '../api'
import { abv, monthName, shortDate, weekday } from '../format'

export function Events({ events }: { events?: EventsResponse }) {
  const [next, ...later] = events?.upcoming ?? []
  const past = events?.past ?? []

  return (
    <section id="events" className="wrap" style={{ paddingBottom: 112 }}>
      <div className="eyebrow">02 — Where to try it</div>
      <h2 className="display h-section" style={{ marginBottom: 20 }}>Events</h2>
      <p className="section-intro">
        The beer isn't for sale, but once in a while it's poured at a local event.
        This is the only place to find it outside the family fridge.
      </p>

      {next ? (
        <EventCard view={next} />
      ) : (
        <p className="stage-empty">No events on the calendar right now. Sign up for batch alerts to hear about the next one.</p>
      )}

      {(later.length > 0 || past.length > 0) && (
        <div className="past-events">
          {later.length > 0 && <span className="mono-sm">Also coming up</span>}
          {later.map(v => <span key={v.event.id}>{v.event.name} · {dateLabel(v)}</span>)}
          {past.length > 0 && <span className="mono-sm">Past events</span>}
          {past.slice(0, 4).map(v => <span key={v.event.id}>{v.event.name} · {dateLabel(v)}</span>)}
        </div>
      )}
    </section>
  )
}

function dateLabel(v: EventView) {
  return v.event.date ? shortDate(v.event.date) : `${monthName(v.event.month)} ${v.event.month.slice(0, 4)}`
}

function EventCard({ view }: { view: EventView }) {
  const e = view.event
  const date = e.date
  const time = e.startTime ? `${e.startTime}${e.endTime ? ` – ${e.endTime}` : ''}` : 'TBA'
  const place = [e.venue, e.address].filter(Boolean).join(', ')
  const facts: [string, ReactNode][] = [
    ['Where', place || 'TBA'],
    ['When', time],
    ...(e.booth ? [['Find us', e.booth] as [string, string]] : []),
    ['Tickets', e.url ? <a href={e.url} target="_blank" rel="noreferrer">{e.tickets ?? 'Event website'}</a> : (e.tickets ?? 'TBA')],
  ]

  return (
    <article className="event-card" aria-labelledby="ev-h">
      <div className="event-date">
        <div className="mono-sm label">Next up</div>
        <div>
          <div className="month">{monthName(date ?? e.month)}</div>
          <div className={`day ${date ? '' : 'tba'}`}>{date ? date.slice(8, 10) : 'TBA'}</div>
          <div className="mono-sm" style={{ marginTop: 10 }}>
            {(date ?? e.month).slice(0, 4)}{date ? ` · ${weekday(date)}` : ''}
          </div>
        </div>
      </div>

      <div className="event-main">
        <h3 id="ev-h" className="display">{e.name}</h3>
        <dl className="event-facts">
          {facts.map(([k, v]) => (
            <div key={k} style={{ display: 'contents' }}>
              <dt className="mono-sm">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
        <div className="btn-row" style={{ marginTop: 8 }}>
          {date && <a className="btn btn-solid" href={api.calendarUrl(e.id)}>Add to calendar</a>}
          {place && (
            <a className="btn" target="_blank" rel="noreferrer"
               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`}>
              Get directions
            </a>
          )}
        </div>
      </div>

      <div className="event-pours">
        <div className="mono-sm" style={{ color: 'var(--muted)' }}>What we're pouring</div>
        {view.pours.length > 0 ? (
          <>
            <ul>
              {view.pours.map(b => (
                <li key={b.number}>
                  <span className="glass" style={{ background: b.color, width: 14, height: 22 }} aria-hidden="true" />
                  <span className="ready-name">
                    <span className="cond">{b.name}</span>
                    <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>{b.style}</span>
                  </span>
                  <span className="mono-sm">{abv(b.abv)}</span>
                </li>
              ))}
            </ul>
            <p className="note">While it lasts — small batches go fast.</p>
          </>
        ) : (
          <p className="note">Lineup to be announced.</p>
        )}
      </div>
    </article>
  )
}
