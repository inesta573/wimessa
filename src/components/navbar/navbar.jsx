import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LocaleLink from '../LocaleLink'
import { useLocale } from '../../hooks/useLocale'
import './navbar.css'
import wimessaLogo from '../../assets/wimessa_logo_white.png'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { locale, switchLocale } = useLocale()

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`navbar ${menuOpen ? 'navbar--open' : ''}`}>
      <LocaleLink to="/" className="navbar-logo" onClick={closeMenu}>
        <img src={wimessaLogo} alt="WIMESSA" className="navbar-logo-img" />
        <span className="navbar-logo-text">WIMESSA</span>
      </LocaleLink>
      <button
        type="button"
        className="navbar-toggle"
        aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="navbar-toggle-bar" />
        <span className="navbar-toggle-bar" />
        <span className="navbar-toggle-bar" />
      </button>
      <ul className="navbar-menu">
        <li><LocaleLink to="/" onClick={closeMenu}>{t('nav.home')}</LocaleLink></li>
        <li><LocaleLink to="/about" onClick={closeMenu}>{t('nav.about')}</LocaleLink></li>
        <li><LocaleLink to="/events" onClick={closeMenu}>{t('nav.events')}</LocaleLink></li>
        <li><LocaleLink to="/maktoub" onClick={closeMenu}>{t('nav.maktoub')}</LocaleLink></li>
        <li><LocaleLink to="/contact" className="nav-contact" onClick={closeMenu}>{t('nav.contact')}</LocaleLink></li>
        <li className="navbar-lang">
          <button
            type="button"
            className={`navbar-lang-btn ${locale === 'en' ? 'navbar-lang-btn--active' : ''}`}
            onClick={() => switchLocale('en')}
            aria-current={locale === 'en' ? 'true' : undefined}
          >
            EN
          </button>
          <span className="navbar-lang-sep">|</span>
          <button
            type="button"
            className={`navbar-lang-btn ${locale === 'fr' ? 'navbar-lang-btn--active' : ''}`}
            onClick={() => switchLocale('fr')}
            aria-current={locale === 'fr' ? 'true' : undefined}
          >
            FR
          </button>
          <span className="navbar-lang-sep">|</span>
          <button
            type="button"
            className={`navbar-lang-btn ${locale === 'ar' ? 'navbar-lang-btn--active' : ''}`}
            onClick={() => switchLocale('ar')}
            aria-current={locale === 'ar' ? 'true' : undefined}
          >
            عربي
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
