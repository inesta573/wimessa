import { useState } from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import wimessaLogo from '../../assets/wimessa_logo_white.png'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className={`navbar ${menuOpen ? 'navbar--open' : ''}`}>
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        <img src={wimessaLogo} alt="WIMESSA" className="navbar-logo-img" />
        <span className="navbar-logo-text">WIMESSA</span>
      </Link>
      <button
        type="button"
        className="navbar-toggle"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="navbar-toggle-bar" />
        <span className="navbar-toggle-bar" />
        <span className="navbar-toggle-bar" />
      </button>
      <ul className="navbar-menu">
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/events" onClick={closeMenu}>Events</Link></li>
        <li><Link to="/maktoub" onClick={closeMenu}>Maktoub</Link></li>
        <li><Link to="/contact" className="nav-contact" onClick={closeMenu}>Contact</Link></li>
      </ul>
    </nav>
  )
}

export default Navbar