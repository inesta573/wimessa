import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Background from './background/bacground'
import Navbar from './navbar/navbar'

const DEFAULT_TITLE = 'WIMESSA'
const DEFAULT_DESCRIPTION = 'WIMESSA – World Islamic and Middle Eastern Studies Student Association. Explore our community, events, and annual publication Maktoub.'

const Layout = ({ children }) => {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!pathname.startsWith('/maktoub')) {
      document.title = DEFAULT_TITLE
      const meta = document.querySelector('meta[name="description"]')
      if (meta) meta.setAttribute('content', DEFAULT_DESCRIPTION)
    }
  }, [pathname])

  return (
    <>
      <Background />
      <Navbar />
      {children}
    </>
  )
}

export default Layout
