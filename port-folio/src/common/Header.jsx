import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";

function Header() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "auto");
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = document.documentElement;
    
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    const handle = () => {
      setScroll(window.scrollY > 50);
    };

    window.addEventListener("scroll", handle);

    return () => window.removeEventListener("scroll", handle);
  }, []);

  const cycleTheme = () => {
    if (theme === "auto") setTheme("light");
    else if (theme === "light") setTheme("dark");
    else setTheme("auto");
  };

  const renderThemeIcon = () => {
    if (theme === "light") return <FaSun title="Light Mode" />;
    if (theme === "dark") return <FaMoon title="Dark Mode" />;
    return <FaDesktop title="Auto (System) Mode" />;
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark custom-navbar sticky-top ${scroll ? "nav-scroll" : ""}`}>
      <div className="container">

        <Link className="navbar-brand logo-text" to="/">
          Portfolio
        </Link>

        <button
          className="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menu">
          <ul className="navbar-nav ms-auto gap-lg-3 align-items-lg-center">

            <li><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li><NavLink className="nav-link" to="/about">About</NavLink></li>
            <li><NavLink className="nav-link" to="/portfolio">Portfolio</NavLink></li>
            <li><NavLink className="nav-link" to="/resume">Resume</NavLink></li>
            <li><NavLink className="nav-link" to="/contact">Contact</NavLink></li>

            <li>
              <button className="theme-btn d-flex justify-content-center align-items-center" onClick={cycleTheme}>
                {renderThemeIcon()}
              </button>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Header;




// import { Link, NavLink } from "react-router-dom";

// function Header() {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top">
//       <div className="container">
//         <Link className="navbar-brand fw-bold logo-text" to="/">
//           Portfolio
//         </Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarMenu"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse" id="navbarMenu">
//           <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
//             <li className="nav-item">
//               <NavLink to="/" className="nav-link">
//                 Home
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink to="/about" className="nav-link">
//                 About
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink to="/portfolio" className="nav-link">
//                 Portfolio
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink to="/resume" className="nav-link">
//                 Resume
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <NavLink to="/contact" className="nav-link">
//                 Contact
//               </NavLink>
//             </li>

//             <li className="nav-item">
//               <a href="#" className="btn btn-theme ms-lg-3">
//                 Hire Me
//               </a>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Header;

