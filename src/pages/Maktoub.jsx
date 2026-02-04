import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './Maktoub.css'

const MAKTOUB_YEARS = [2024, 2023, 2022]

const MAKTOUB_DESCRIPTION = 'Maktoub is WIMESSA’s annual publication—a collection of essays, art, and reflections from our community in Islamic and Middle Eastern studies. Browse the archive by year.'

const Maktoub = () => {
  useEffect(() => {
    document.title = 'Maktoub | WIMESSA'
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', MAKTOUB_DESCRIPTION)
  }, [])

  return (
    <main className="page maktoub-page">
      <section className="maktoub-about">
        <div className="maktoub-about-inner">
          <h2 className="maktoub-about-heading">About Maktoub</h2>
          <p className="maktoub-about-text">
            Maktoub is WIMESSA’s annual publication. It is a collection of essays, art, and reflections
            from our community. Each edition captures a year of ideas and voices in Islamic and
            Middle Eastern studies.
          </p>
        </div>
      </section>

      <section className="maktoub-archive">
        <div className="maktoub-archive-inner">
          <h2 className="maktoub-archive-title">Archive</h2>
          <ul className="maktoub-archive-grid">
            {MAKTOUB_YEARS.map((year) => (
              <li key={year} className="maktoub-archive-item">
                <Link
                  to={`/maktoub/${year}`}
                  className="maktoub-archive-link"
                  aria-label={`Maktoub ${year}`}
                >
                  <span className="maktoub-archive-year">{year}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Maktoub
