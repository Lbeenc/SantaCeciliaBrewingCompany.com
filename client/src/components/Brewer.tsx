import type { SiteInfo } from '../api'

export function Brewer({ site }: { site?: SiteInfo }) {
  const paragraphs = (site?.brewerStory ?? '').split(/\n\s*\n/).filter(Boolean)

  return (
    <section id="brewer" className="brewer">
      <div className="wrap section split">
        <div className="photo">
          <span className="photo-tag">Photo · the brewer</span>
        </div>
        <div className="brewer-copy">
          <div className="eyebrow">04 — The brewer</div>
          <h2 className="display h-section">{site?.brewerName ?? '…'}</h2>
          <div className="brewer-story">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          {site?.brewerQuote && <blockquote className="brewer-quote">“{site.brewerQuote}”</blockquote>}
        </div>
      </div>
    </section>
  )
}
