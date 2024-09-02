import React, { StrictMode } from "react"; // Import React and hooks correctly
import { createRoot } from "react-dom/client";
import App from "./App";
import "./base/base.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App /> {/* Use App component to include RouterProvider and useEffect */}
  </StrictMode>
);
