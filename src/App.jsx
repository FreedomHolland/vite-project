import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Feedback from "./components/pages/Feedback";
import BootStandBy from "./components/pages/BootStandBy";
import TasteSelector from "./components/pages/TasteSelector/TasteSelector";
import Configs from "./components/pages/Configs/Configs";

export default function App() {
  // Function to check backend status
  const checkBackendStatus = async () => {
    try {
      const response = await fetch("http://localhost:3003/api/status"); // Ensure backend is running on this port
      const data = await response.text();
      console.log("Backend status:", data); // Log the status from backend
    } catch (error) {
      console.error("Error fetching backend status:", error);
    }
  };

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
    {
      path: "/configs",
      element: <Configs />,
    },
  ]);

  // useEffect to check the backend status once when the app loads
  useEffect(() => {
    checkBackendStatus(); // Check backend status on initial load
  }, []);

  return <RouterProvider router={router} />;
}
