import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { log as logUtility } from "@utils/logUtility"; // Import the log function with a different name
import { IconButton } from "@mui/material";
import strawberry from "./../../../assets/img/button-1.png";
import apple from "./../../../assets/img/button-2.png";
import lemon from "./../../../assets/img/button.png";
import "./styles.scss";

export default function TasteSelector() {
  const navigate = useNavigate();
  const [logMessage, setLogMessage] = useState("");
  const [error, setError] = useState(null);
  const [hasCupOrCan, setHasCupOrCan] = useState(false); // New state to track can/cup presence

  const updateCupOrCanStatus = (log) => {
    // Check if the log contains can or cup information
    if (log.includes("CAN is placed") || log.includes("CUP is placed")) {
      setHasCupOrCan(true);
    } else {
      setHasCupOrCan(false);
    }
  };

  const triggerdespensorCycle = async (flavor) => {
    if (!hasCupOrCan) {
      setError("No cup or can detected. Please place a cup or can.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3003/api/machine-process`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taste: flavor }),
        }
      );
      if (!response.ok) throw new Error("Failed to trigger machine process");
      logUtility(`Triggered process for flavor: ${flavor}`);
      // Handle response or state updates if needed
    } catch (error) {
      setError(`Error triggering process: ${error.message}`);
      logUtility(`Error triggering process: ${error.message}`);
    }
  };

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const response = await fetch("http://localhost:3003/api/logs");
        if (!response.ok) throw new Error("Failed to fetch GPIO log");
        const data = await response.json();
        setLogMessage(data.log); // Update state with the latest log
        logUtility(`Latest GPIO Log: ${data.log}`); // Log to console

        // Update cup or can status based on the latest log
        updateCupOrCanStatus(data.log);

        // Navigate based on the log content
        if (data.log.includes("Nothing is placed")) {
          navigate("/");
        }

        // here I have to use the var in taste_2
        if (data.log.includes("despensorCycle Taste_2")) {
          navigate("/");
        }
      } catch (error) {
        setError("Error fetching GPIO log.");
        logUtility(`Error fetching GPIO log: ${error.message}`);
      }
    };

    fetchLog(); // Initial fetch
    const logInterval = setInterval(fetchLog, 500); // Fetch every 500ms

    return () => clearInterval(logInterval); // Clean up interval on unmount
  }, [navigate]);

  const buttonClick = () => {
    navigate("/configs");
  };

  return (
    <div className="taste-selector-container">
      <div className="logs">
        {error && <p className="error">{error}</p>}
        <div className="status">{logMessage}</div>
      </div>
      <div className="buttons">
        <button
          onClick={() => triggerdespensorCycle("Taste_1")}
          className="strawberry"
        >
          <img src={strawberry} />
        </button>
        <button
          onClick={() => triggerdespensorCycle("Taste_2")}
          className="lemon"
        >
          <img src={lemon} />
        </button>
        <button
          onClick={() => triggerdespensorCycle("Taste_3")}
          className="apple"
        >
          <img src={apple} />
        </button>
      </div>
      <IconButton className="configs-button" onClick={buttonClick}>
        <span className="material-symbols-outlined">settings</span>
      </IconButton>
    </div>
  );
}
