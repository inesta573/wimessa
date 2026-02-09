import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { SUPPORTED_LOCALES } from '../i18n'

/**
 * Returns current locale from URL and a function to switch to another locale
 * while staying on the same page.
 */
export function useLocale() {
  const { locale } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const currentLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en'

  const switchLocale = (newLocale) => {
    if (!SUPPORTED_LOCALES.includes(newLocale) || newLocale === currentLocale) return
    const pathname = location.pathname
    const pathWithoutLocale = pathname.replace(new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})`), '') || '/'
    const newPath = `/${newLocale}${pathWithoutLocale}`
    navigate(newPath + location.search)
  }

  return { locale: currentLocale, switchLocale }
}
