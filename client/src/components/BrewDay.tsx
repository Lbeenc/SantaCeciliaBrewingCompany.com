const STEPS = [
  { title: 'Mash', spec: '~60 min · 148–156°F', body: 'Crushed grain soaks in hot water, turning starches into sugars.' },
  { title: 'Boil', spec: '~60 min', body: 'The wort comes to a rolling boil and the hops go in — early for bitterness, late for aroma.' },
  { title: 'Ferment', spec: '~2 weeks · 64–68°F', body: 'Cooled wort goes into the fermenter with yeast and is left alone to do its work.' },
  { title: 'Keg or bottle', spec: '1–3 weeks', body: 'Packaged, carbonated and given time to settle before the first glass.' },
]

export function BrewDay() {
  return (
    <section id="brewday" className="on-dark">
      <div className="wrap section">
        <div className="eyebrow">03 — How a batch gets made</div>
        <h2 className="display h-section" style={{ marginBottom: 56 }}>Brew Day</h2>
        <div className="split">
          <div className="photo dark">
            <span className="photo-tag">Photo · the kettle on brew day</span>
          </div>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="step-no">{String(i + 1).padStart(2, '0')}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="step-head">
                    <h3 className="display">{s.title}</h3>
                    <span className="step-spec">{s.spec}</span>
                  </div>
                  <p>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <p className="fine-print">Times and temperatures are typical for an ale; every recipe is a little different.</p>
      </div>
    </section>
  )
}
