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
                className="project-card glass-card tilt-card h-100"
                whileHover={{
                  rotateX: 6,
                  rotateY: -6,
                  scale: 1.03,
                }}
                transition={{ duration: 0.3 }}
              >

                <img
                  src={item.image}
                  alt={item.title}
                  className="project-img img-fluid"
                  loading="lazy"
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />

                <h4 className="mt-3">
                  {item.title}
                </h4>
                
                {item.description && (
                  <p className="text-light mt-2 mb-1" style={{ fontSize: '0.9rem' }}>
                    {item.description}
                  </p>
                )}

                <p className="text-light small mt-2">
                  React.js | Bootstrap | Responsive UI
                </p>

                <div className="d-flex gap-3 mt-3">

                  <a
                    href={item.github || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="overlay-btn"
                  >
                    <FaGithub />
                  </a>

                  <a
                    href={item.live || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="overlay-btn"
                  >
                    <FaExternalLinkAlt />
                  </a>

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