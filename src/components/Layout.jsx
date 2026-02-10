import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Background from './background/bacground'
import Navbar from './navbar/navbar'
import Footer from './footer/Footer'
import './Layout.css'

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
    <div className="layout">
      <Background />
      <Navbar />
      <div className="layout-content">{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
