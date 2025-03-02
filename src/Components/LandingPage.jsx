import "./../styles/Header.css";
import "./../styles/LandingPage.css";
import { Link } from 'react-router-dom';
import Footer from "./../Components/Footer.jsx";

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-gif">
            <img src="public/giphy.gif" alt="Hero GIF" />
          </div>
          <div className="hero-text">
            <h1>Capture Your Moments, Share Your Inspiration</h1>
            <p>Join a vibrant community of creators and find inspiration in every corner.</p>
            <div className="cta-buttons">
              <Link to="/register" className="register-button">Register</Link>
              <Link to="/login" className="login-button">Login</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about-us" className="about-us">
        <div className="about-content">
          <div className="about-text">
            <h2>Discover the Power of Creativity</h2>
            <p>We believe in the transformative power of visual storytelling. Our platform is more than just a website – it's a vibrant community where creators from all walks of life come together to share, inspire, and grow.</p>
            
            <div className="about-highlights">
              <div className="highlight">
                <div className="highlight-icon">🌍</div>
                <h3>Global Community</h3>
                <p>Connect with creators from around the world, breaking down barriers and sharing unique perspectives.</p>
              </div>
              
              <div className="highlight">
                <div className="highlight-icon">🚀</div>
                <h3>Endless Inspiration</h3>
                <p>Explore a diverse collection of content that sparks creativity and pushes the boundaries of imagination.</p>
              </div>
              
              <div className="highlight">
                <div className="highlight-icon">💡</div>
                <h3>Creative Tools</h3>
                <p>Access powerful tools and resources designed to help you bring your creative vision to life.</p>
              </div>
            </div>
          </div>
          
          <div className="about-image">
            <img src="public/image.jpg" alt="Creative Community" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;