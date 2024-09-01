import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { log as logUtility } from '@utils/logUtility'; // Import the log function with a different name

export default function BootStandBy() {
  const navigate = useNavigate();
  const [logMessage, setLogMessage] = useState(''); // Renamed state variable
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await fetch('http://localhost:3003/api/logs');
        if (!response.ok) throw new Error('Failed to fetch GPIO log');
        const data = await response.json();
        setLogMessage(data.log); // Update state with the latest log 
        logUtility(`Latest GPIO Log: ${data.log}`); // Log to console

        // Navigate based on the log content
        if (data.log.includes("CAN") || data.log.includes("CUP")) {
          navigate("/taste-selector");
        }
      } catch (error) {
        setError('Error fetching GPIO log.');
        logUtility(`Error fetching GPIO log: ${error.message}`);
      }
    };

    fetchLog(); // Initial fetch
    const logInterval = setInterval(fetchLog, 500); // Fetch every 50ms

    return () => clearInterval(logInterval); // Clean up interval on unmount
  }, [navigate]);

  return (
    <div className="boot-standby-container">
      {/* Your screen content */}
    </div>
  );
}
