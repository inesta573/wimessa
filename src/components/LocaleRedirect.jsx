import { Navigate } from 'react-router-dom'
import { SUPPORTED_LOCALES } from '../i18n'

/**
 * Redirects / to /en or /fr based on browser language preference.
 */
const LocaleRedirect = () => {
  const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'en'
  let preferred = 'en'
  if (browserLang.startsWith('fr')) preferred = 'fr'
  else if (browserLang.startsWith('ar')) preferred = 'ar'
  const locale = SUPPORTED_LOCALES.includes(preferred) ? preferred : 'en'
  return <Navigate to={`/${locale}`} replace />
}

export default LocaleRedirect
