import Background from './background/bacground'
import Navbar from './navbar/navbar'

const Layout = ({ children }) => {
  return (
    <>
      <Background />
      <Navbar />
      {children}
    </>
  )
}

export default Layout
