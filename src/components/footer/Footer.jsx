import { useTranslation } from 'react-i18next'
import './footer.css'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-content">
          <h2 className="footer-org-name">{t('footer.orgName')}</h2>
          <a href={`mailto:${t('footer.email')}`} className="footer-email" aria-label={t('footer.emailLabel')}>
            <span className="footer-email-icon" aria-hidden>✉</span>
            {t('footer.email')}
          </a>
          <p className="footer-copyright">{t('footer.copyright')}</p>
        </div>
        <button
          type="button"
          className="footer-back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('footer.backToTop')}
        >
          ▲
        </button>
      </div>
      <div className="footer-acknowledgment">
        <p>
          <strong>{t('footer.landAcknowledgmentTitle')}</strong>{' '}
          {t('footer.landAcknowledgmentText')}
        </p>
      </div>
    </footer>
  )
}

export default Footer
