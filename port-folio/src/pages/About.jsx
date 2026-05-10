import { motion } from "framer-motion";

function About() {
  return (
    <motion.section
      className="page-space"
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -35 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container">
        <h1 className="page-title text-center">About Me</h1>

        <div className="glass-card p-5 mt-5">
          <p className="text-light">
            I create modern React websites with premium UI and performance.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

export default About;

// function About() {
//   return (
//     <section className="page-space">
//       <div className="container">
//         <h1 className="page-title text-center">
//           About Me
//         </h1>

//         <div className="row g-4 mt-4">

//           <div className="col-lg-6">
//             <div className="glass-card p-4 h-100">
//               <h3>Who I Am</h3>

//               <p className="text-light mt-3">
//                 I am a passionate frontend developer focused on
//                 React.js, Bootstrap 5 and premium modern UI design.
//               </p>

//               <p className="text-light">
//                 I build responsive, fast and clean websites that
//                 create great user experiences.
//               </p>
//             </div>
//           </div>

//           <div className="col-lg-6">
//             <div className="glass-card p-4 h-100">
//               <h3>Experience</h3>

//               <ul className="mt-3 text-light">
//                 <li>Responsive Web Design</li>
//                 <li>React Projects</li>
//                 <li>Landing Pages</li>
//                 <li>Portfolio Websites</li>
//                 <li>Bootstrap UI Development</li>
//               </ul>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

// export default About;