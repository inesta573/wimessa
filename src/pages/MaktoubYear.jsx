import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LocaleLink from '../components/LocaleLink'
import FlipBook from '../components/flipbook/flipBook'
import './MaktoubYear.css'

const MAKTOUB_PDFS = {
  // 2024: maktoub2024,
}

const MaktoubYear = () => {
  const { year } = useParams()
  const { t } = useTranslation()
  const file = year ? MAKTOUB_PDFS[year] : null

  useEffect(() => {
    document.title = year ? `${t('maktoub.yearTitle', { year })} | WIMESSA` : `${t('maktoub.title')} | WIMESSA`
    const meta = document.querySelector('meta[name="description"]')
    if (meta && year) {
      meta.setAttribute('content', t('maktoub.metaDescriptionYear', { year }))
    }
  }, [year, t])

  return (
    <main className="page maktoub-year-page">
      <div className="maktoub-year-inner">
        <LocaleLink to="/maktoub" className="maktoub-year-back">
          {t('maktoub.backToMaktoub')}
        </LocaleLink>
        <h1 className="maktoub-year-title">{t('maktoub.yearTitle', { year })}</h1>
        <FlipBook file={file} year={year} />
      </div>
    </main>
  )
}

export default MaktoubYear
