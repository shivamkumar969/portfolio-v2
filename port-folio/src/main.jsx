import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./index.css";
import "./css/variables.css";
import "./css/animations.css";
import "./App.css";
import "./css/responsive.css"; // Moved to bottom so it overrides everything else

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);