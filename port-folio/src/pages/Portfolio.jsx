import Projects from "../components/Projects";

function Portfolio() {
  return (
    <section className="page-space">
      <div className="container">
        <h1 className="page-title text-center">
          My Portfolio
        </h1>

        <Projects />
      </div>
    </section>
  );
}

export default Portfolio;