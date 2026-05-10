function Skills() {
  const skills = [
    "HTML5",
    "CSS3",
    "JavaScript",
    "Bootstrap 5",
    "React.js",
    "Git & GitHub"
  ];

  return (
    <section className="skills-section">
      <div className="container">
        <h2 className="section-title text-center">My Skills</h2>

        <div className="row g-4 mt-4">
          {skills.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div className="skill-box glass-card">
                {item}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;