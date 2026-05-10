import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import PortFolio from "../assets/images/PortFolio.png";
import Complaint from "../assets/images/Complaint.jpg";
import ChatBot from "../assets/images/ChatBot.png";

function Projects() {
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

  return (
    <section className="projects-section page-space">
      <div className="container">

        <h2 className="section-title text-center">
          My Projects
        </h2>

        <p className="text-center text-light mt-3">
          Some of my recent work built using React.js,
          Bootstrap and modern UI design.
        </p>

        <div className="row g-4 mt-4">

          {projects.map((item) => (
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
      </div>
    </section>
  );
}

export default Projects;


// import { useState } from "react";
// import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

// function Projects() {
//   const allProjects = [
//     {
//       id: 1,
//       title: "React Portfolio",
//       category: "React",
//       image: "https://via.placeholder.com/500x320",
//     },
//     {
//       id: 2,
//       title: "Business Landing Page",
//       category: "Landing",
//       image: "https://via.placeholder.com/500x320",
//     },
//     {
//       id: 3,
//       title: "Dashboard UI",
//       category: "UI",
//       image: "https://via.placeholder.com/500x320",
//     },
//     {
//       id: 4,
//       title: "Ecommerce Store",
//       category: "React",
//       image: "https://via.placeholder.com/500x320",
//     },
//     {
//       id: 5,
//       title: "Agency Website",
//       category: "Landing",
//       image: "https://via.placeholder.com/500x320",
//     },
//     {
//       id: 6,
//       title: "Admin Panel",
//       category: "UI",
//       image: "https://via.placeholder.com/500x320",
//     },
//   ];

//   const [active, setActive] = useState("All");

//   const filters = ["All", "React", "UI", "Landing"];

//   const filtered =
//     active === "All"
//       ? allProjects
//       : allProjects.filter((item) => item.category === active);

//   return (
//     <section className="projects-section">
//       <div className="container">

//         <h2 className="section-title text-center">
//           Featured Projects
//         </h2>

//         {/* Filter Buttons */}
//         <div className="filter-wrap text-center mt-4">
//           {filters.map((btn, index) => (
//             <button
//               key={index}
//               className={`filter-btn ${active === btn ? "active-filter" : ""}`}
//               onClick={() => setActive(btn)}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>

//         {/* Cards */}
//         <div className="row g-4 mt-4">

//           {filtered.map((project) => (
//             <div className="col-lg-4 col-md-6" key={project.id}>
//               <div className="project-card premium-project glass-card">

//                 <div className="project-img-wrap">
//                   <img
//                     src={project.image}
//                     alt={project.title}
//                     className="project-img"
//                   />

//                   <div className="project-overlay">
//                     <a href="#" className="overlay-btn">
//                       <FaGithub />
//                     </a>

//                     <a href="#" className="overlay-btn">
//                       <FaExternalLinkAlt />
//                     </a>
//                   </div>
//                 </div>

//                 <div className="mt-3">
//                   <h4>{project.title}</h4>
//                   <p className="text-light mb-0">
//                     {project.category} Project
//                   </p>
//                 </div>

//               </div>
//             </div>
//           ))}

//         </div>
//       </div>
//     </section>
//   );
// }

// export default Projects;











// function Projects() {
//   const projects = [1, 2, 3];

//   return (
//     <section className="projects-section">
//       <div className="container">
//         <h2 className="section-title text-center">Featured Projects</h2>

//         <div className="row g-4 mt-4">
//           {projects.map((item) => (
//             <div className="col-lg-4" key={item}>
//               <div className="project-card glass-card">
//                 <img
//                   src="https://via.placeholder.com/400x250"
//                   alt="project"
//                   className="project-img"
//                 />

//                 <h4 className="mt-3">Project {item}</h4>

//                 <p className="text-light">
//                   Modern portfolio / business website built with React.
//                 </p>

//                 <button className="btn btn-theme">
//                   Live Preview
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Projects;