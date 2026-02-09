import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Layout from './components/Layout'
import LocaleRedirect from './components/LocaleRedirect'
import LocaleRoutes from './components/LocaleRoutes'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Maktoub from './pages/Maktoub'
import MaktoubYear from './pages/MaktoubYear'
import Contact from './pages/Contact'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LocaleRedirect />} />
        <Route path=":locale" element={
          <LocaleRoutes>
            <Layout>
              <Outlet />
            </Layout>
          </LocaleRoutes>
        }>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetail />} />
          <Route path="maktoub" element={<Maktoub />} />
          <Route path="maktoub/:year" element={<MaktoubYear />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
