import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Background from './background/bacground'
import Navbar from './navbar/navbar'

const Layout = ({ children }) => {
  const { pathname } = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    if (!pathname.includes('/maktoub')) {
      document.title = t('common.defaultTitle')
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', t('common.defaultDescription'))
    }
  }, [pathname, t])

  return (
    <>
      <Background />
      <Navbar />
      {children}
    </>
  )
}

export default Layout
