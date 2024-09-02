import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Step1 } from "../../../assets/icons/Step1";
import { log as logUtility } from "@utils/logUtility"; // Import the log function with a different name

import "./styles.scss";

export default function Feedback() {
  const navigate = useNavigate();
  const [logMessage, setLogMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await fetch("http://localhost:3003/api/logs");
        if (!response.ok) throw new Error("Failed to fetch GPIO log");
        const data = await response.json();
        setLogMessage(data.log); // Update state with the latest log
        logUtility(`Latest GPIO Log: ${data.log}`); // Log to console

        // Navigate based on the log content
        if (data.log.includes("Nothing is placed")) {
          navigate("/");
        }
      } catch (error) {
        setError("Error fetching GPIO log.");
        logUtility(`Error fetching GPIO log: ${error.message}`);
      }
    };

    fetchLog(); // Initial fetch
    const logInterval = setInterval(fetchLog, 500); // Fetch every 50ms

    return () => clearInterval(logInterval); // Clean up interval on unmount
  }, [navigate]);

  return (
    <div className="feedback-container">
      <div className="div">
        <Step1 className="circular" />
        {/* Your SlimpieWordGemaakt component */}
      </div>
    </div>
  );
}
