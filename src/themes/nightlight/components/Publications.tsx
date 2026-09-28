import { publications } from '../../../data'
import { tiltHandlers } from '../tilt'

export default function Publications() {
  if (publications.length === 0) return null
  return (
    <section id="research" className="section">
      <div className="section-head">
        <h2>Research</h2>
        <p>Peer-reviewed writing on fintech, digital assets and the trust that holds them together.</p>
      </div>
      <ol className="pubs">
        {publications.map((p) => (
          <li key={p.title} className="pub">
            <a
              className="paper"
              href={p.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open the paper: ${p.title}`}
              {...tiltHandlers(14)}
            >
              <span className="paper-sheet paper-sheet--back" aria-hidden="true" />
              <span className="paper-sheet" aria-hidden="true">
                <span className="paper-venue">{p.venue}</span>
                <span className="paper-title">{p.title}</span>
                <span className="paper-authors">{p.authors}</span>
                <span className="paper-lines">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} style={{ width: `${[100, 94, 98, 88, 100, 76, 96, 90, 60][i]}%` }} />
                  ))}
                </span>
                <span className="paper-seal">{p.year}</span>
              </span>
            </a>
            <div className="pub-body">
              <div className="pub-tags">
                <span className="pub-kind">{p.kind} article</span>
                {p.badge && <span className="pub-badge">{p.badge}</span>}
                <span className="pub-year">{p.year}</span>
              </div>
              <h3 className="pub-title" lang="id">
                {p.title}
              </h3>
              <p className="pub-venue">
                <em>{p.venue}</em>
              </p>
              <p className="pub-authors">{p.authors}</p>
              {p.summary && <p className="pub-summary">{p.summary}</p>}
              {p.keywords && (
                <ul className="stack pub-keywords" aria-label="Keywords">
                  {p.keywords.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              )}
              <div className="pub-actions">
                {p.href && (
                  <a className="btn btn--primary btn--sm" href={p.href} target="_blank" rel="noreferrer">
                    Read the paper
                  </a>
                )}
                {p.doi && (
                  <a className="pub-doi" href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer">
                    DOI {p.doi}
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
