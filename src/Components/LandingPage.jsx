
import "./../styles/Header.css";
import "./../styles/LandingPage.css";
import Footer from "./../Components/Footer.jsx";

const LandingPage = () => {
  return (
    <div className="landing-page">
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Capture Your Moments, Share Your Inspiration</h1>
          <p>Join a vibrant community of creators and find inspiration in every corner.</p>
          <button className="cta-button">View More →</button>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery">
        <h2>Start Sharing Your Moments Today!</h2>
        <p>Enhance Your Profile with Your Unique Style.</p>
        <div className="gallery-container">
          <div className="gallery-item">
            <img src="/capture.png" alt="capture" />
            <p><br />Capture</p>
          </div>
          <div className="gallery-item">
            <img src="/your.png" alt="your" />
            <p><br />Your</p>
          </div>
          <div className="gallery-item">
            <img src="/moments.png" alt="moment" />
            <p><br />Moments</p>
          </div>
          <div className="gallery-item">
            <img src="/now.png" alt="now" />
            <p><br />Now</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
    
  );
};

export default LandingPage;