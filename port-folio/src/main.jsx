import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";
import "./css/variables.css";
import "./css/animations.css";
import "./css/responsive.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);


// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";

// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";

// import "./index.css";
// import "./css/variables.css";
// import "./css/animations.css";
// import "./css/responsive.css";
// import "./App.css";

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );