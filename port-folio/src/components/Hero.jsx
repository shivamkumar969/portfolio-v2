import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";
import Sliderbar from "../common/Sliderbar";
import Shivam from "../assets/images/Shivam.png";

function Hero() {
  return (
    <section className="hero-section premium-hero mobile-force-fix">
      {/* Desktop Social Sidebar */}
      <div className="d-none d-lg-block">
        <Sliderbar />
      </div>

      {/* Background Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      <div className="container">
        <div className="row align-items-center mobile-row-fix flex-column-reverse flex-lg-row">

          {/* Left Content */}
          <div className="col-lg-6 text-center text-lg-start mt-5 mt-lg-0 content-col-fix">
            <span className="hero-tag">Hello, I'm</span>
            
            <h1 className="hero-title">Shivam Kumar</h1>

            <h2 className="hero-subtitle">
              <ReactTyped strings={["React Developer", "Frontend Engineer", "UI Designer", "Freelancer"]} typeSpeed={60} backSpeed={40} loop />
            </h2>

            <p className="hero-text mx-auto mx-lg-0">
              I build premium modern websites with React.js,
              Bootstrap 5, responsive layouts and smooth
              user experiences.
            </p>

            <div className="d-flex gap-3 mt-4 flex-wrap justify-content-center justify-content-lg-start">
              <Link to="/portfolio" className="btn btn-theme">View Projects</Link>
              <Link to="/contact" className="btn btn-outline-light rounded-pill px-4">Hire Me</Link>
            </div>

            {/* Mobile Social Icons */}
            <div className="mt-4 d-lg-none">
               <Sliderbar />
            </div>
          </div>

          {/* Right Image */}
          <div className="col-lg-6 text-center mt-5 mt-lg-0">
            <div className="hero-card premium-card d-flex justify-content-center align-items-center">
              <img src={Shivam} alt="Profile" className="hero-img" loading="eager" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;