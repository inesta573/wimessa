import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import LocaleLink from '../components/LocaleLink'
import { useLocale } from '../hooks/useLocale'
import { formatNumber } from '../utils/numbers'
import './Maktoub.css'

const MAKTOUB_YEARS = [2025]

const Maktoub = () => {
  const { t } = useTranslation()
  const { locale } = useLocale()

  useEffect(() => {
    document.title = `${t('maktoub.title')} | WIMESSA`
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', t('maktoub.metaDescription'))
  }, [t])

  return (
    <main className="page maktoub-page">
      <section className="maktoub-about">
        <div className="maktoub-about-inner">
          <h2 className="maktoub-about-heading">{t('maktoub.aboutTitle')}</h2>
          <p className="maktoub-about-text">{t('maktoub.aboutText')}</p>
        </div>
      </section>

      <section className="maktoub-archive">
        <div className="maktoub-archive-inner">
          <h2 className="maktoub-archive-title">{t('maktoub.archive')}</h2>
          <ul className="maktoub-archive-grid">
            {MAKTOUB_YEARS.map((year) => (
              <li key={year} className="maktoub-archive-item">
                <LocaleLink
                  to={`/maktoub/${year}`}
                  className="maktoub-archive-link"
                  aria-label={`Maktoub ${year}`}
                >
                  <span className="maktoub-archive-year">{formatNumber(year, locale)}</span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

export default Maktoub
