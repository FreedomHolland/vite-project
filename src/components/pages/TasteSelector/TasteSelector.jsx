import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { log as logUtility } from '@utils/logUtility'; // Import the log function with a different name

import './styles.scss';

export default function TasteSelector() {
  const navigate = useNavigate();
  const [logMessage, setLogMessage] = useState('');
  const [error, setError] = useState(null);
  const [hasCupOrCan, setHasCupOrCan] = useState(false); // New state to track can/cup presence

  const updateCupOrCanStatus = (log) => {
    // Check if the log contains can or cup information
    if (log.includes('CAN is placed') || log.includes('CUP is placed')) {
      setHasCupOrCan(true);
    } else {
      setHasCupOrCan(false);
    }
  };

  const triggerMachineProcess = async (flavor) => {
    if (!hasCupOrCan) {
      setError('No cup or can detected. Please place a cup or can.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3003/api/machine-process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ taste: flavor })
      });
      if (!response.ok) throw new Error('Failed to trigger machine process');
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
        const response = await fetch('http://localhost:3003/api/logs');
        if (!response.ok) throw new Error('Failed to fetch GPIO log');
        const data = await response.json();
        setLogMessage(data.log); // Update state with the latest log
        logUtility(`Latest GPIO Log: ${data.log}`); // Log to console

        // Update cup or can status based on the latest log
        updateCupOrCanStatus(data.log);

        // Navigate based on the log content
        if (data.log.includes("Nothing is placed")) {
          navigate("/");
        }
      } catch (error) {
        setError('Error fetching GPIO log.');
        logUtility(`Error fetching GPIO log: ${error.message}`);
      }
    };

    fetchLog(); // Initial fetch
    const logInterval = setInterval(fetchLog, 500); // Fetch every 500ms

    return () => clearInterval(logInterval); // Clean up interval on unmount
  }, [navigate]);

  return (
    <div className="taste-selector-container">
      {error && <p className="error">{error}</p>}
      <div className="status">{logMessage}</div>
      <div className="buttons">
        <button onClick={() => triggerMachineProcess('Taste_1')} className="strawberry"></button>
        <button onClick={() => triggerMachineProcess('Taste_2')} className="lemon"></button>
        <button onClick={() => triggerMachineProcess('Taste_3')} className="apple"></button>
      </div>
    </div>
  );
}
