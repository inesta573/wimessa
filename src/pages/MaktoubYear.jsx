import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LocaleLink from '../components/LocaleLink'
import FlipBook from '../components/flipbook/flipBook'
import { useLocale } from '../hooks/useLocale'
import { formatNumber } from '../utils/numbers'
import './MaktoubYear.css'
import maktoub2025 from '../assets/maktoub2025.pdf'

const MAKTOUB_PDFS = {
  2025: maktoub2025,
}

const MaktoubYear = () => {
  const { year } = useParams()
  const { t } = useTranslation()
  const { locale } = useLocale()
  const yearFormatted = year ? formatNumber(year, locale) : ''
  const file = year ? MAKTOUB_PDFS[year] : null

  useEffect(() => {
    document.title = year ? `${t('maktoub.yearTitle', { year: yearFormatted })} | WIMESSA` : `${t('maktoub.title')} | WIMESSA`
    const meta = document.querySelector('meta[name="description"]')
    if (meta && year) {
      meta.setAttribute('content', t('maktoub.metaDescriptionYear', { year: yearFormatted }))
    }
  }, [year, yearFormatted, t])

  return (
    <main className="page maktoub-year-page">
      <div className="maktoub-year-inner">
        <LocaleLink to="/maktoub" className="maktoub-year-back">
          {t('maktoub.backToMaktoub')}
        </LocaleLink>
        <h1 className="maktoub-year-title">{t('maktoub.yearTitle', { year: yearFormatted })}</h1>
        <FlipBook file={file} year={year} />
      </div>
    </main>
  )
}

export default MaktoubYear
