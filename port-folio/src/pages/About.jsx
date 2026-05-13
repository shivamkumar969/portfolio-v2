import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaFilePdf, FaLaptopCode } from "react-icons/fa";
import { Link } from "react-router-dom";

function About() {
  const [bio, setBio] = useState("I create premium modern websites leveraging advanced React.js architectures, sleek Bootstrap 5 responsive frameworks, and fluid user experiences designed for peak accessibility and visual brilliance.");
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/settings`);
        const data = await res.json();
        if (data) {
          if (data.aboutContent) setBio(data.aboutContent);
          if (data.resumeUrl) {
            const fullPath = data.resumeUrl.startsWith("http")
              ? data.resumeUrl
              : `${API_URL}${data.resumeUrl.startsWith("/") ? "" : "/"}${data.resumeUrl}`;
            setResumeLink(fullPath);
          }
        }
      } catch (error) {
        console.error("Failed to fetch custom setting state:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <motion.section
      className="page-space"
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -35 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container max-w-4xl mx-auto px-3">
        <h1 className="page-title text-center text-gradient m-0">About Me</h1>
        <p className="text-center text-light mt-2 mb-5 small opacity-75">
          Architectural domain background and professional core metrics.
        </p>

        <div className="row g-4">
          {/* Main Narrative Block */}
          <div className="col-12">
            <div className="glass-card p-4 p-md-5 position-relative" style={{ borderRadius: '24px' }}>
              <span className="position-absolute top-0 start-0 translate-middle p-3 bg-theme rounded-circle text-dark fw-bold shadow-lg d-none d-md-flex align-items-center justify-content-center" style={{ width: '54px', height: '54px' }}>
                <FaLaptopCode size={24} />
              </span>
              
              <h3 className="fw-bold mb-3 text-gradient">Who I Am</h3>
              <p className="text-light mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {bio}
              </p>

              {/* Dynamic Action Zone */}
              <div className="d-flex flex-wrap gap-3 align-items-center pt-4 border-top border-secondary border-opacity-10">
                {resumeLink ? (
                  <a 
                    href={resumeLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-theme px-4 py-3 fw-bold d-flex align-items-center gap-2 shadow-lg"
                    style={{ borderRadius: '12px' }}
                  >
                    <FaFilePdf size={18} /> View Documented Resume
                  </a>
                ) : (
                  <Link 
                    to="/resume" 
                    className="btn btn-theme px-4 py-3 fw-bold d-flex align-items-center gap-2 shadow-lg text-decoration-none"
                    style={{ borderRadius: '12px' }}
                  >
                    <FaFilePdf size={18} /> View Documented CV
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default About;