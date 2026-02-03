import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Maktoub from './pages/Maktoub'
import Contact from './pages/Contact'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
      <Route path="/events" element={<Layout><Events /></Layout>} />
      <Route path="/maktoub" element={<Layout><Maktoub /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
