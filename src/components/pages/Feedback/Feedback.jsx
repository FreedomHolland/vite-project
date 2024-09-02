import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { log as logUtility } from "@utils/logUtility"; // Import the log function with a different name
import { CircularProgress, IconButton } from "@mui/material";
import "./styles.scss";

export default function Feedback() {
  const navigate = useNavigate();
  const [logMessage, setLogMessage] = useState("");
  const [error, setError] = useState(null);
  const [progressMessage, setProgressMessage] = useState(
    "Drink is being prepared"
  );
  const progress = 100;

  const buttonClick = () => {
    navigate("/configs");
  };

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

  useEffect(() => {
    if (progress !== 100) {
      setProgressMessage("Drink is being prepared");
    }

    if (progress === 100) {
      setProgressMessage("Drink is ready");

      const timer = setTimeout(() => {
        setProgressMessage("Please pick up your drink");
      }, 10000); // Change message after 10 seconds

      return () => clearTimeout(timer); // Clean up timeout on unmount or progress change
    }
  }, [progress]);

  return (
    <div className="feedback-container">
      <div className="container">
        {progress === 100 ? (
          <span id="check-icon" className="material-symbols-outlined">
            check_circle
          </span>
        ) : (
          <CircularProgress thickness={1} size={250} value={progress} />
        )}
        <div className="texts">
          <span className="text">Status progress</span>
          <span className="progress">{`${progress} to 100%`}</span>
          <span className="text">End user: feedback</span>
          <span className="message">{progressMessage}</span>
        </div>
      </div>
      <IconButton className="icon" onClick={buttonClick}>
        <span className="material-symbols-outlined">settings</span>
      </IconButton>
    </div>
  );
}
