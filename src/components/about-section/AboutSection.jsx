import { Link } from 'react-router-dom'
import './about-section.css'
import aboutImage from '../../assets/Header_background.jpg'

const AboutSection = () => {
  return (
    <section className="about-section">
      <div className="about-section-image">
        <img src={aboutImage} alt="About WIMESSA" />
      </div>
      <div className="about-section-content">
        <h2 className="about-section-title">About WIMESSA</h2>
        <p className="about-section-text">
          The World Islamic and Middle Eastern Studies Student Association brings together
          students and scholars interested in Islamic and Middle Eastern studies. Learn more
          about our mission, history, and community.
        </p>
        <Link to="/about" className="about-section-button">
          Learn more
        </Link>
      </div>
    </section>
  )
}

export default AboutSection
