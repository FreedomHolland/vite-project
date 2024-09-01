import React, { StrictMode, useEffect } from "react"; // Import React and hooks correctly
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Feedback from "./components/pages/Feedback";
import BootStandBy from "./components/pages/BootStandBy";
import TasteSelector from "./components/pages/TasteSelector/TasteSelector";
import "./base/base.scss";

// Function to check backend status
const checkBackendStatus = async () => {
  try {
    const response = await fetch('http://localhost:3003/api/status'); // Ensure backend is running on this port
    const data = await response.text();
    console.log('Backend status:', data); // Log the status from backend
  } catch (error) {
    console.error('Error fetching backend status:', error);
  }
};


function App() {
  // useEffect to check the backend status once when the app loads
  useEffect(() => {
    checkBackendStatus(); // Check backend status on initial load
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

// Define your router
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
    <App /> {/* Use App component to include RouterProvider and useEffect */}
  </StrictMode>
);
