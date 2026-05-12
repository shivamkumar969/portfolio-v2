import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function Skills() {
  const defaultSkills = [
    { name: "HTML5", iconName: "FaHtml5", color: "#E34F26" },
    { name: "CSS3", iconName: "FaCss3Alt", color: "#1572B6" },
    { name: "JavaScript", iconName: "FaJs", color: "#F7DF1E" },
    { name: "Bootstrap 5", iconName: "FaBootstrap", color: "#7952B3" },
    { name: "React.js", iconName: "FaReact", color: "#61DAFB" },
    { name: "Git & GitHub", iconName: "FaGithub", color: "#f8fafc" }
  ];

  const [skills, setSkills] = useState(defaultSkills);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const fetchSkills = async () => {
      try {
        const res = await fetch(`${API_URL}/api/skills`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSkills(data);
        }
      } catch (error) {
        console.error("Failed to fetch live database skills:", error);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section className="skills-section page-space">
      <div className="container">
        <h2 className="section-title text-center text-gradient m-0">My Skills</h2>
        <p className="text-center text-light mt-2 mb-5 small">
          Technologies and core architectures I leverage to construct premium web applications.
        </p>

        <div className="row g-3 g-md-4 justify-content-center">
          {skills.map((item, index) => {
            // Dynamic wildcard lookup maps vector models dynamically from string identifiers across both Fa and Si libraries
            const IconComponent = FaIcons[item.iconName] || SiIcons[item.iconName] || FaIcons.FaCode;
            return (
              <div className="col-6 col-md-4 col-lg-3" key={index}>
                <motion.div 
                  className="skill-box glass-card d-flex flex-column align-items-center justify-content-center gap-2 h-100"
                  style={{ padding: '22px 14px', borderRadius: '20px' }}
                  whileHover={{ y: -6, scale: 1.03, borderColor: item.color }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent size={42} style={{ color: item.color || "#8b5cf6" }} />
                  <span className="fw-bold mt-2 text-light small text-truncate w-100 text-center" style={{ fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                    {item.name}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;