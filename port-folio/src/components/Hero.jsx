import { Link } from "react-router-dom";
import { ReactTyped } from "react-typed";
import Sliderbar from "../common/Sliderbar";
// import Shivam from "../assets/images/shivam.jpg";
import Shivam from "../assets/images/Shivam.png";

function Hero() {
  return (
    <section className="hero-section premium-hero">
      {/* Social Sidebar */}
      <Sliderbar />

      {/* Background Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>

      <div className="container">
        <div className="row align-items-center min-vh-100 flex-column-reverse flex-lg-row">

          {/* Left Content */}
          <div className="col-lg-6 text-center text-lg-start mt-5 mt-lg-0">

            <span className="hero-tag">
              Hello, I'm
            </span>

            <h1 className="hero-title">
              Shivam Kumar
            </h1>

            <h2 className="hero-subtitle">
              <ReactTyped strings={[ "React Developer", "Frontend Engineer", "UI Designer", "Freelancer" ]} typeSpeed={60} backSpeed={40} loop />
            </h2>

            <p className="hero-text mx-auto mx-lg-0">
              I build premium modern websites with React.js,
              Bootstrap 5, responsive layouts and smooth
              user experiences.
            </p>

            <div className="d-flex gap-3 mt-4 flex-wrap justify-content-center justify-content-lg-start">

              <Link to="/portfolio" className="btn btn-theme">
                View Projects
              </Link>

              <Link
                to="/contact"
                className="btn btn-outline-light rounded-pill px-4"
              >
                Hire Me
              </Link>

            </div>

          </div>

          {/* Right Image */}
          <div className="col-lg-6 text-center mt-5 mt-lg-0">
            <div className="hero-card premium-card d-flex justify-content-center align-items-center">
              <img
                // src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&q=80"
                src={Shivam}
                alt="Profile"
                className="hero-img"
                loading="eager"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;









// import { Link } from "react-router-dom";
// import Sliderbar from "../common/Sliderbar";

// function Hero() {
//   return (
//     <section className="hero-section">
//       <Sliderbar />

//       <div className="container">
//         <div className="row align-items-center min-vh-100">

//           <div className="col-lg-6">
//             <span className="hero-tag">Hello, I'm</span>

//             <h1 className="hero-title">
//               Your Name
//             </h1>

//             <h2 className="hero-subtitle">
//               React Web Developer
//             </h2>

//             <p className="hero-text">
//               I create premium responsive websites with React.js,
//               Bootstrap 5, animations and modern UI/UX design.
//             </p>

//             <div className="d-flex gap-3 mt-4 flex-wrap">
//               <Link to="/portfolio" className="btn btn-theme">
//                 View Work
//               </Link>

//               <Link to="/contact" className="btn btn-outline-light rounded-pill px-4">
//                 Contact Me
//               </Link>
//             </div>
//           </div>

//           <div className="col-lg-6 text-center mt-5 mt-lg-0">
//             <div className="hero-card glass-card">
//               <img
//                 src="https://via.placeholder.com/430x430"
//                 alt="profile"
//                 className="hero-img"
//               />
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

// export default Hero;