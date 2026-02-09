import { Link, useParams } from 'react-router-dom'
import { SUPPORTED_LOCALES } from '../i18n'

/**
 * Link that preserves the current locale in the path.
 * Use for internal navigation: <LocaleLink to="/about">...</LocaleLink>
 */
const LocaleLink = ({ to, children, state, ...props }) => {
  const { locale } = useParams()

  const resolvedLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'en'
  const path = typeof to === 'string' ? to : to?.pathname ?? '/'
  const normalizedPath = (path === '/' || path === '') ? '' : (path.startsWith('/') ? path : `/${path}`)
  const localePath = `/${resolvedLocale}${normalizedPath}`

  return (
    <Link to={localePath} state={state} {...props}>
      {children}
    </Link>
  )
}

export default LocaleLink
