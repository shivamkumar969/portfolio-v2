import { FaHeart, FaReact } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-area py-5 border-top border-secondary border-opacity-10 mt-auto" style={{ background: 'rgba(10, 15, 30, 0.65)', backdropFilter: 'blur(12px)' }}>
      <div className="container text-center">
        {/* Dynamic Route Shortcut Map */}
        <div className="d-flex flex-wrap justify-content-center gap-4 mb-4 small fw-medium">
          <Link to="/" className="text-light text-decoration-none nav-link px-2">Home</Link>
          <Link to="/portfolio" className="text-light text-decoration-none nav-link px-2">Projects</Link>
          <Link to="/about" className="text-light text-decoration-none nav-link px-2">About</Link>
          <Link to="/contact" className="text-light text-decoration-none nav-link px-2">Contact</Link>
          <Link to="/admin" className="text-theme text-decoration-none nav-link fw-bold px-2">Admin Portal</Link>
        </div>

        {/* Primary Dynamic Copyright */}
        <p className="mb-2 text-light fw-medium" style={{ fontSize: '0.95rem' }}>
          © {currentYear} <span className="text-theme fw-bold">Shivam Kumar</span>. All Rights Reserved.
        </p>
        
        {/* Micro-Animation Accented Stack Tags */}
        <div className="opacity-75 d-inline-flex align-items-center gap-1 justify-content-center flex-wrap" style={{ fontSize: '0.8rem' }}>
          <span>Engineered with</span>
          <FaHeart className="text-danger animate-pulse mx-1" size={12} />
          <span>using</span>
          <FaReact className="text-info animate-spin ms-1 me-1" size={14} style={{ animationDuration: '6s' }} />
          <span className="fw-medium">React.js & Bootstrap 5</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;