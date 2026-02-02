import { Link } from 'react-router-dom'
import './join-us-section.css'

const JoinUsSection = () => {
  return (
    <section className="join-us-section">
      <h2 className="join-us-section-title">Join us</h2>
      <p className="join-us-section-text">
        Interested in Islamic and Middle Eastern studies? Get in touch to join WIMESSA,
        hear about events, or learn how you can get involved.
      </p>
      <Link to="/contact" className="join-us-section-button">
        Contact us
      </Link>
    </section>
  )
}

export default JoinUsSection
