import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import './MaktoubYear.css'

const MaktoubYear = () => {
  const { year } = useParams()

  useEffect(() => {
    document.title = year ? `Maktoub ${year} | WIMESSA` : 'Maktoub | WIMESSA'
    const meta = document.querySelector('meta[name="description"]')
    if (meta && year) {
      meta.setAttribute('content', `Read Maktoub ${year} – WIMESSA’s annual publication for ${year}. Essays, art, and reflections from the Islamic and Middle Eastern studies community.`)
    }
  }, [year])

  return (
    <main className="page maktoub-year-page">
      <div className="maktoub-year-inner">
        <Link to="/maktoub" className="maktoub-year-back">
          Back to Maktoub
        </Link>
        <h1 className="maktoub-year-title">Maktoub {year}</h1>
        <p className="maktoub-year-intro">
          This year’s edition. Book content or viewer can be added here.
        </p>
      </div>
    </main>
  )
}

export default MaktoubYear
