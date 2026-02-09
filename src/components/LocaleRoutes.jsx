import { useParams, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LOCALES } from '../i18n'

/**
 * Validates locale from URL and redirects to /en if invalid.
 * Syncs i18n language with URL locale.
 */
const LocaleRoutes = ({ children }) => {
  const { locale } = useParams()
  const { i18n } = useTranslation()

  const isValidLocale = SUPPORTED_LOCALES.includes(locale)

  useEffect(() => {
    if (isValidLocale && i18n.language !== locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale, isValidLocale, i18n])

  // Update html lang and dir (RTL for Arabic)
  useEffect(() => {
    if (isValidLocale) {
      document.documentElement.lang = locale
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    }
  }, [locale, isValidLocale])

  if (!isValidLocale) {
    const path = window.location.pathname
    const rest = path.replace(/^\/[^/]+/, '') || ''
    return <Navigate to={`/en${rest}`} replace />
  }

  return children
}

export default LocaleRoutes
