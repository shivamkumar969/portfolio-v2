import { Helmet } from "react-helmet";

import Hero from "../components/Hero";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ContactForm from "../components/ContactForm";

function Home() {
  return (
    <>
      <Helmet>
        <title>Shivam | React Developer</title>
        <meta
          name="description"
          content="Modern React developer portfolio with premium UI design."
        />
      </Helmet>

      <Hero />
      <Skills />
      <Projects />

      <section className="container py-5">
        <h2 className="section-title text-center mb-5">
          Contact Me
        </h2>

        <ContactForm />
      </section>
    </>
  );
}

export default Home;




// import Hero from "../components/Hero";
// import Skills from "../components/Skills";
// import Projects from "../components/Projects";
// import ContactForm from "../components/ContactForm";

// function Home() {
//   return (
//     <>
//       <Hero />
//       <Skills />
//       <Projects />

//       <section className="container py-5">
//         <h2 className="section-title text-center mb-5">
//           Contact Me
//         </h2>

//         <ContactForm />
//       </section>
//     </>
//   );
// }

// export default Home;