import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import PortFolio from "../assets/images/PortFolio.png";
import Complaint from "../assets/images/Complaint.jpg";
import ChatBot from "../assets/images/ChatBot.png";

function Projects({ limit }) {
  const [projects, setProjects] = useState([]);
  
  const fallbackProjects = [
    {
      id: "f1",
      title: "Portfolio Website",
      image: PortFolio,
      github: "#",
      live: "#",
    },
    {
      id: "f2",
      title: "Dashboard UI",
      image: ChatBot,
      github: "#",
      live: "https://chatbott-80bq.onrender.com/chat",
    },
    {
      id: "f3",
      title: "Business Landing Page",
      image: Complaint,
      github: "#",
      live: "https://share.google/Y6lfKg1Pk8zMSEwJm",
    },
  ];

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_URL}/api/projects`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects(fallbackProjects);
      }
    };
    fetchProjects();
  }, []);

  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <section className="projects-section page-space">
      <div className="container">

        <h2 className="section-title text-center">
          {limit ? "Featured Projects" : "All Projects"}
        </h2>

        <p className="text-center text-light mt-3">
          {limit 
            ? "A selection of my best work built using modern technologies." 
            : "A complete list of my professional work and personal projects."}
        </p>

        <div className="row g-4 mt-4">

          {displayedProjects.map((item) => (
            <div className="col-lg-4 col-md-6" key={item.id}>

              <motion.div
                className="project-card glass-card h-100 d-flex flex-column premium-project-card"
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >

                <div className="project-img-wrap">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="project-img img-fluid"
                    loading="lazy"
                  />
                  
                  <div className="project-overlay">
                    {item.github && item.github !== "#" && (
                      <a
                        href={item.github}
                        target="_blank"
                        rel="noreferrer"
                        className="overlay-btn"
                        title="View Source Code"
                      >
                        <FaGithub size={20} />
                      </a>
                    )}
                    {item.live && item.live !== "#" && (
                      <a
                        href={item.live}
                        target="_blank"
                        rel="noreferrer"
                        className="overlay-btn"
                        title="View Live Demo"
                      >
                        <FaExternalLinkAlt size={18} />
                      </a>
                    )}
                  </div>
                </div>

                <div className="project-content mt-3 d-flex flex-column flex-grow-1">
                  <h4 className="project-title fw-bold text-gradient mb-2">
                    {item.title}
                  </h4>
                  
                  {item.description && (
                    <p className="text-light flex-grow-1 mb-3" style={{ fontSize: '0.92rem', lineHeight: '1.6' }}>
                      {item.description}
                    </p>
                  )}

                  <div className="mt-auto pt-3 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                    <span className="text-light small fw-semibold opacity-75">
                      React.js • Modern UI
                    </span>
                    
                    {/* Always visible responsive quick links for touch devices or immediate clicks */}
                    <div className="d-flex gap-3 align-items-center">
                      {item.github && item.github !== "#" && (
                        <a
                          href={item.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-light hover-theme"
                          title="Source Code"
                        >
                          <FaGithub size={16} />
                        </a>
                      )}
                      {item.live && item.live !== "#" && (
                        <a
                          href={item.live}
                          target="_blank"
                          rel="noreferrer"
                          className="text-theme fw-bold small d-flex align-items-center gap-1 text-decoration-none"
                          title="Live Demo"
                        >
                          Live <FaExternalLinkAlt size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </motion.div>

            </div>
          ))}

        </div>

        {limit && (
          <div className="text-center mt-5">
            <Link to="/portfolio" className="btn btn-theme px-5 py-3">
              View All Projects
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;