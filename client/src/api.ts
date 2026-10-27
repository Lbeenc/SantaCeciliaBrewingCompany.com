// Types mirror server/SantaCecilia.Api/Models.cs. Dates arrive as "YYYY-MM-DD" strings.

export type BatchStage = 'planned' | 'fermenting' | 'conditioning' | 'ready' | 'archived'

export interface Batch {
  number: number
  name: string
  style: string
  abv: number | null
  ibu: number | null
  color: string
  stage: BatchStage
  brewedOn: string | null
  packagedOn: string | null
  plannedFor: string | null
  notes: string | null
}

export interface BrewEvent {
  id: string
  name: string
  date: string | null
  month: string
  startTime: string | null
  endTime: string | null
  venue: string | null
  address: string | null
  booth: string | null
  tickets: string | null
  url: string | null
  pouring: number[]
}

export interface EventView {
  event: BrewEvent
  pours: Batch[]
}

export interface LogEntry {
  number: number
  date: string
  tag: string
  title: string
  excerpt: string
}

export interface SiteInfo {
  brewerName: string
  town: string
  brewingSince: number | null
  batchSizeGallons: number | null
  nextBrewDay: string | null
  brewerStory: string
  brewerQuote: string
}

export interface SiteSummary {
  site: SiteInfo
  batchesBrewed: number
  stylesTried: number
  updatedOn: string | null
}

export interface EventsResponse {
  upcoming: EventView[]
  past: EventView[]
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${path} failed with ${res.status}`)
  return res.json() as Promise<T>
}

export const api = {
  site: () => get<SiteSummary>('/api/site'),
  batches: () => get<Batch[]>('/api/batches'),
  events: () => get<EventsResponse>('/api/events'),
  logbook: (take = 3) => get<LogEntry[]>(`/api/logbook?take=${take}`),
  calendarUrl: (id: string) => `/api/events/${encodeURIComponent(id)}/calendar.ics`,

  async subscribe(email: string): Promise<{ added: boolean }> {
    const res = await fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (res.status === 400) throw new Error('Enter a valid email address.')
    if (!res.ok) throw new Error('Something went wrong. Please try again.')
    return res.json()
  },
}
