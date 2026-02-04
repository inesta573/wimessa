import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import FlipBook from '../components/flipbook/flipBook'
import './MaktoubYear.css'

// Add PDFs here when ready: import the file and add the year to MAKTOUB_PDFS
// e.g. import maktoub2024 from '../assets/maktoub2024.pdf'
const MAKTOUB_PDFS = {
  // 2024: maktoub2024,
}

const MaktoubYear = () => {
  const { year } = useParams()
  const file = year ? MAKTOUB_PDFS[year] : null

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
        <FlipBook file={file} year={year} />
      </div>
    </main>
  )
}

export default MaktoubYear
