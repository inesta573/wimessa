import './background.css'
import backgroundImage from '../../assets/Header_background.jpg'

const Background = () => {
  return (
    <div
      className="site-background"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      aria-hidden="true"
    />
  )
}

export default Background