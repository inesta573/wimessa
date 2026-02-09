import { useTranslation } from 'react-i18next'
import LocaleLink from '../LocaleLink'
import './join-us-section.css'

const JoinUsSection = () => {
  const { t } = useTranslation()
  return (
    <section className="join-us-section">
      <h2 className="join-us-section-title">{t('joinUs.title')}</h2>
      <p className="join-us-section-text">{t('joinUs.text')}</p>
      <LocaleLink to="/contact" className="join-us-section-button">
        {t('joinUs.button')}
      </LocaleLink>
    </section>
  )
}

export default JoinUsSection
