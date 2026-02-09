import { useTranslation } from 'react-i18next'
import './mission-section.css'

const MissionSection = () => {
  const { t } = useTranslation()
  return (
    <section className="mission-section">
      <h2 className="mission-section-title">{t('mission.title')}</h2>
      <p className="mission-section-text">{t('mission.text')}</p>
    </section>
  )
}

export default MissionSection
