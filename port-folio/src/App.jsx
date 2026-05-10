import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Header from "./common/Header";
import Footer from "./common/Footer";
import Loader from "./common/Loader";

import Home from "./pages/Home";
import About from "./pages/About";
import Portfolio from "./pages/Portfolio";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  if (loading) return <Loader />;

  return (
    <BrowserRouter>
      <div className="scroll-progress"></div>
      <Header />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;





// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useEffect, useState } from "react";

// import Header from "./common/Header";
// import Footer from "./common/Footer";
// import Loader from "./common/Loader";

// import Home from "./pages/Home";
// import About from "./pages/About";
// import Portfolio from "./pages/Portfolio";
// import Resume from "./pages/Resume";
// import Contact from "./pages/Contact";

// function App() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1800);
//   }, []);

//   useEffect(() => {
//     const glow = document.querySelector(".cursor-glow");

//     const move = (e) => {
//       glow.style.left = e.clientX + "px";
//       glow.style.top = e.clientY + "px";
//     };

//     window.addEventListener("mousemove", move);

//     return () => window.removeEventListener("mousemove", move);
//   }, []);

//   if (loading) return <Loader />;

//   return (
//     <BrowserRouter>

//       <div className="cursor-glow"></div>
//       <div className="particles"></div>

//       <Header />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/about" element={<About />} />
//         <Route path="/portfolio" element={<Portfolio />} />
//         <Route path="/resume" element={<Resume />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>

//       <Footer />

//     </BrowserRouter>
//   );
// }

// export default App;



// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Header from "./common/Header";
// import Footer from "./common/Footer";

// import Home from "./pages/Home";
// import About from "./pages/About";
// import Portfolio from "./pages/Portfolio";
// import Resume from "./pages/Resume";
// import Contact from "./pages/Contact";

// function App() {
//   return (
//     <BrowserRouter>
//       <Header />

//       <main>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/portfolio" element={<Portfolio />} />
//           <Route path="/resume" element={<Resume />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </main>

//       <Footer />
//     </BrowserRouter>
//   );
// }

// export default App;