import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";
import Sliderbar from "../common/Sliderbar";
import Shivam from "../assets/images/Shiva.png";
import { FaReact, FaCheckCircle } from "react-icons/fa";

function Hero() {
  const [tiltStyle, setTiltStyle] = useState({ transform: "rotateX(0deg) rotateY(0deg)" });
  const [heroImgSrc, setHeroImgSrc] = useState(Shivam);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data?.heroImageUrl) {
          const fullPath = data.heroImageUrl.startsWith("http") 
            ? data.heroImageUrl 
            : `${API_URL}/${data.heroImageUrl.replace(/\\/g, '/')}`;
          setHeroImgSrc(fullPath);
        }
      })
      .catch(err => console.error("Exception loading dynamic profile picture overrides:", err));
  }, []);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    const rotateY = x * 28; 
    const rotateX = -y * 28;
    setTiltStyle({ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ transform: "rotateX(0deg) rotateY(0deg)", transition: "transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)" });
  };

  return (
    <section className="hero-section premium-hero mobile-force-fix overflow-hidden">
      {/* Desktop Social Sidebar */}
      <div className="d-none d-lg-block">
        <Sliderbar />
      </div>

      {/* Background Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      <div className="container">
        <div className="row align-items-center mobile-row-fix flex-column flex-lg-row">

          {/* Left Content */}
          <div className="col-lg-6 text-center text-lg-start mt-5 mt-lg-0 content-col-fix" style={{ zIndex: 2 }}>
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

          {/* Right Immersive 3D Viewport */}
          <div className="col-lg-6 text-center mt-5 mt-lg-0 d-flex justify-content-center" style={{ zIndex: 5 }}>
            <div 
              className="perspective-wrapper w-100 py-5" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave}
              style={{ cursor: "grab" }}
            >
              <div className="hero-3d-container" style={tiltStyle}>
                
                {/* Immersive Outer Spatial Orbits */}
                <div className="orbital-ring"></div>
                <div className="orbital-ring-2"></div>

                {/* Dynamic Spatial Card 1 */}
                <div className="floating-3d-card top-left text-start">
                  <div className="d-flex align-items-center gap-2">
                    <FaReact size={24} className="text-info animate-spin" style={{ animationDuration: '8s' }} />
                    <div>
                      <div className="fw-bold small text-light m-0" style={{ fontSize: '0.8rem' }}>React 19 Core</div>
                      <div className="opacity-50" style={{ fontSize: '0.65rem' }}>Hardware Accelerated</div>
                    </div>
                  </div>
                </div>

                {/* Target Profile Geometry Layer */}
                <div className="hero-img-container mx-auto position-relative" style={{ transform: "translateZ(40px)", transition: "all 0.1s ease" }}>
                  <div className="hero-glow-circle"></div>
                  <img src={heroImgSrc} alt="Shivam Kumar" className="hero-img object-fit-cover" loading="eager" />
                </div>

                {/* Dynamic Spatial Card 2 */}
                <div className="floating-3d-card bottom-right text-start">
                  <div className="d-flex align-items-center gap-2">
                    <FaCheckCircle size={20} className="text-success" />
                    <div>
                      <div className="fw-bold small text-light m-0" style={{ fontSize: '0.8rem' }}>Full Stack Bound</div>
                      <div className="opacity-50" style={{ fontSize: '0.65rem' }}>Secure Mongoose JSON</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;
