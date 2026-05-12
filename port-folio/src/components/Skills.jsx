import { FaHtml5, FaCss3Alt, FaJs, FaBootstrap, FaReact, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

function Skills() {
  const skills = [
    { name: "HTML5", icon: FaHtml5, color: "#E34F26" },
    { name: "CSS3", icon: FaCss3Alt, color: "#1572B6" },
    { name: "JavaScript", icon: FaJs, color: "#F7DF1E" },
    { name: "Bootstrap 5", icon: FaBootstrap, color: "#7952B3" },
    { name: "React.js", icon: FaReact, color: "#61DAFB" },
    { name: "Git & GitHub", icon: FaGithub, color: "#f8fafc" }
  ];

  return (
    <section className="skills-section page-space">
      <div className="container">
        <h2 className="section-title text-center text-gradient m-0">My Skills</h2>
        <p className="text-center text-light mt-2 mb-5 small">
          Technologies and core architectures I leverage to construct premium web applications.
        </p>

        <div className="row g-3 g-md-4 justify-content-center">
          {skills.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div className="col-6 col-md-4 col-lg-3" key={index}>
                <motion.div 
                  className="skill-box glass-card d-flex flex-column align-items-center justify-content-center gap-2 h-100"
                  style={{ padding: '22px 14px', borderRadius: '20px' }}
                  whileHover={{ y: -6, scale: 1.03, borderColor: item.color }}
                  transition={{ duration: 0.3 }}
                >
                  <IconComponent size={42} style={{ color: item.color }} />
                  <span className="fw-bold mt-2 text-light small" style={{ fontSize: '0.95rem', letterSpacing: '0.5px' }}>
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