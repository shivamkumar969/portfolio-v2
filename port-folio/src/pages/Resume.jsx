import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import resumeFile from "../assets/resume/shivam_resume.pdf";

function Resume() {
  const [liveResumeUrl, setLiveResumeUrl] = useState("");

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${API_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.resumeUrl) {
          const fullPath = data.resumeUrl.startsWith("http")
            ? data.resumeUrl
            : `${API_URL}${data.resumeUrl.startsWith("/") ? "" : "/"}${data.resumeUrl}`;
          setLiveResumeUrl(fullPath);
        }
      })
      .catch((err) => console.error("Error loading dynamic CV resource:", err));
  }, []);

  return (
    <section className="page-space">
      <Helmet>
        <title>Resume | Shivam Kumar</title>
        <meta
          name="description"
          content="Download Shivam Kumar's professional frontend developer resume."
        />
      </Helmet>

      <div className="container">

        <h1 className="page-title text-center">
          Resume
        </h1>

        <p className="text-center text-light mt-3">
          Frontend Developer specializing in React.js, Bootstrap,
          JavaScript and responsive web design.
        </p>

        <div className="glass-card p-5 mt-5 text-center">

          <h3 className="mb-3">
            Shivam Kumar
          </h3>

          <h5 className="text-info mb-4">
            Frontend Web Developer
          </h5>

          <p className="text-light mb-2">
            Skills: HTML5, CSS3, JavaScript, React.js, Bootstrap 5
          </p>

          <p className="text-light mb-4">
            Tools: GitHub, VS Code, Responsive Design
          </p>

          <a
            href={liveResumeUrl || resumeFile}
            target="_blank"
            rel="noopener noreferrer"
            download="Shivam_Kumar_Resume.pdf"
            className="btn btn-theme px-4 py-2 fw-bold shadow"
          >
            Download CV
          </a>

        </div>

      </div>
    </section>
  );
}

export default Resume;






// function Resume() {
//   return (
//     <section className="page-space">
//       <div className="container">
//         <h1 className="page-title text-center">
//           Resume
//         </h1>

//         <div className="glass-card p-5 mt-5 text-center">
//           <h3>Frontend Web Developer</h3>

//           <p className="text-light mt-3">
//             Skills: HTML, CSS, JavaScript, React.js, Bootstrap 5
//           </p>

//           <p className="text-light">
//             Tools: GitHub, VS Code, Responsive Design
//           </p>

//           <a href="#" className="btn btn-theme mt-3">
//             Download Resume
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Resume;