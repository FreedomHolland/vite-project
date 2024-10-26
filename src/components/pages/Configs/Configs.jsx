import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CustomSwitch from "../../CustomSwitch/CustomSwitch";
import "./styles.scss";

export default function Configs() {
  const navigate = useNavigate();

  const quantity = 100;
  const [mainWaterState, setMainWaterState] = useState(false);
  const [peltierStates, setPeltierStates] = useState({
    TASTE_1: false,
    TASTE_2: false,
    TASTE_3: false,
  });
  const [tempStates, setTempStates] = useState({
    TEMP_1: false,
    TEMP_2: false,
    TEMP_3: false,
  });

  const [peltier1Temp, setPeltier1Temp] = useState(null); // State for Peltier #1 temperature

  useEffect(() => {
    // Fetch temperature from the backend API
    const fetchTemperature = async () => {
      try {
        const response = await fetch("/api/temperature");
        const data = await response.json();
        setPeltier1Temp(data.temperature); // Assuming the API returns temperature in the 'temperature' field
      } catch (error) {
        console.error("Error fetching temperature:", error);
      }
    };

    fetchTemperature();
  }, []); // Fetch once when component mounts

  const tastes = [
    { title: "Taste 1", quantity: 50, name: "TASTE_1" },
    { title: "Taste 2", quantity: 800, name: "TASTE_2" },
    { title: "Taste 3", quantity: 1000, name: "TASTE_3" },
  ];

  const firstPeltier = [
    { title: "Peltier #1", degrees: peltier1Temp || "no input", name: "PELTIER_1", targetTemp: true }, // Updated to display the fetched temperature
    { title: "Peltier #2", degrees: 800, name: "PELTIER_2", targetTemp: false },
    { title: "Peltier #3", degrees: 1000, name: "PELTIER_3", targetTemp: true },
  ];

  const temperatureList = [
    { title: "Temp #1", degrees: 50, name: "TEMP_1", targetTemp: false },
    { title: "Temp #2", degrees: 800, name: "TEMP_2", targetTemp: true },
    { title: "Temp #3", degrees: 1000, name: "TEMP_3", targetTemp: false },
  ];

  const mainWaterSwitch = (value) => {
    setMainWaterState(value);
  };

  const tasteSwitch = (name, value) => {
    console.log(name, value);
  }
  // Send a request to the backend to start the pump for the selected taste
  fetch('/api/machine-process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ taste: name }), // Send the name of the taste (Taste_1, Taste_2, etc.)
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to start the pump');
    }
    console.log(`Pump for ${name} ${value ? 'enabled' : 'disabled'}`);
  })
  .catch((error) => {
    console.error('Error activating pump:', error);
  });

  const firstPeltierSwitch = (name, value) => {
    setPeltierStates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const temperatureSwitch = (name, value) => {
    setTempStates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const degreeBoxClasses = (states, item) => {
    let color = "";

    if (!states[item.name]) {
      color = "gray";
    } else if (item.targetTemp) {
      color = "green";
    } else {
      color = "red";
    }

    return `degree ${color}`;
  };

  return (
    <div className="configs-container">
      <div className="right-side">
        <div className={`main ${mainWaterState ? "enabled" : ""}`}>
          <span className="text">Main water</span>
          <CustomSwitch
            checked={mainWaterState}
            onChange={(event) => mainWaterSwitch(event.target.checked)}
          />
          <span className="total">{`xxx: ${quantity} ml`}</span>
        </div>
        <div className="tastes-box">
          <div className="tastes">
            {tastes.map((taste) => (
              <div key={taste.name} className="taste">
                <span className="text">{taste.title}</span>
                <CustomSwitch
                  onChange={(event) =>
                    tasteSwitch(taste.name, event.target.checked) 
                  }
                />
                <span className="total">{`xxx: ${taste.quantity} ml`}</span>
              </div>
            ))}
          </div>
          <span className="enable">Enable Taste dispensers</span>
        </div>
        <Button startIcon={<ArrowBackIcon />} color="error" variant="outlined" className='return-button' onClick={() => navigate("/")}>Return to main</Button>
      </div>
      <div className="left-side">
        <span className="title">Cooler tempertures per segment</span>
        <div className="first-peltier">
          {firstPeltier.map((peltier) => (
            <div key={peltier.name} className="box">
              <span className="text">{peltier.title}</span>
              <span
                className={degreeBoxClasses(peltierStates, peltier)}
              >{`${peltier.degrees} °C`}</span>
              <CustomSwitch
                onChange={(event) =>
                  firstPeltierSwitch(peltier.name, event.target.checked)
                }
              />
            </div>
          ))}
        </div>
        <div className="infos">
          <span>Green = On temp</span>
          <span>Red = Below target temp</span>
          <span>Grey = Disabled</span>
        </div>
        <div className="temperature-list">
          {temperatureList.map((temp) => (
            <div key={temp.name} className="box">
              <span className="text">{temp.title}</span>
              <div
                className={degreeBoxClasses(tempStates, temp)}
              >{`${temp.degrees} °C`}</div>
              <CustomSwitch
                onChange={(event) =>
                  temperatureSwitch(temp.name, event.target.checked)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
