import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Feedback from "./components/pages/Feedback";
import BootStandBy from "./components/pages/BootStandBy";
import TasteSelector from "./components/pages/TasteSelector/TasteSelector";
import "./base/base.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BootStandBy />,
  },
  {
    path: "/taste-selector",
    element: <TasteSelector />,
  },
  {
    path: "/feedback",
    element: <Feedback />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
