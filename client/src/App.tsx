import { useEffect, useState } from 'react'
import { api, type Batch, type EventsResponse, type LogEntry, type SiteSummary } from './api'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Stats } from './components/Stats'
import { Batches } from './components/Batches'
import { Events } from './components/Events'
import { BrewDay } from './components/BrewDay'
import { Brewer } from './components/Brewer'
import { Logbook } from './components/Logbook'
import { BatchAlerts } from './components/BatchAlerts'
import { Footer } from './components/Footer'

interface Data {
  summary?: SiteSummary
  batches: Batch[]
  events?: EventsResponse
  logbook: LogEntry[]
}

export default function App() {
  const [data, setData] = useState<Data>({ batches: [], logbook: [] })
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([api.site(), api.batches(), api.events(), api.logbook(3)])
      .then(([summary, batches, events, logbook]) => {
        if (!cancelled) setData({ summary, batches, events, logbook })
      })
      .catch(() => !cancelled && setFailed(true))
    return () => { cancelled = true }
  }, [])

  const nextEvent = data.events?.upcoming[0]
  const ready = data.batches.filter(b => b.stage === 'ready')

  return (
    <>
      <Header nextEvent={nextEvent} />
      <main>
        {failed && (
          <p className="wrap" role="alert" style={{ paddingTop: 24, color: 'var(--rust)' }}>
            Couldn't load the latest batches. Please refresh in a minute.
          </p>
        )}
        <Hero summary={data.summary} ready={ready} nextEvent={nextEvent} />
        <Stats summary={data.summary} />
        <Batches batches={data.batches} />
        <Events events={data.events} />
        <BrewDay />
        <Brewer site={data.summary?.site} />
        <Logbook entries={data.logbook} />
        <BatchAlerts />
      </main>
      <Footer />
    </>
  )
}
