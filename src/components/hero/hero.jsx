import { useTranslation } from 'react-i18next'
import './hero.css'

const Hero = () => {
  const { t } = useTranslation()
  return (
    <section className="hero">
      <h1 className="hero-title">{t('hero.title')}</h1>
      <p className="hero-subtitle">{t('hero.subtitle')}</p>
    </section>
  )
}

export default Hero