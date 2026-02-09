import { useTranslation } from 'react-i18next'
import LocaleLink from '../LocaleLink'
import './about-section.css'
import aboutImage from '../../assets/teamImage.jpeg'

const AboutSection = () => {
  const { t } = useTranslation()
  return (
    <section className="about-section">
      <div className="about-section-image">
        <img src={aboutImage} alt={t('aboutSection.imageAlt')} />
      </div>
      <div className="about-section-content">
        <h2 className="about-section-title">{t('aboutSection.title')}</h2>
        <p className="about-section-text">{t('aboutSection.text')}</p>
        <LocaleLink to="/about" className="about-section-button">
          {t('aboutSection.button')}
        </LocaleLink>
      </div>
    </section>
  )
}

export default AboutSection
