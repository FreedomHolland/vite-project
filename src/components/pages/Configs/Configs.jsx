import { useState } from "react";
import CustomSwitch from "../../CustomSwitch/CustomSwitch";
import "./styles.scss";

export default function Configs() {
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

  const tastes = [
    { title: "Taste 1", quantity: 50, name: "TASTE_1" },
    { title: "Taste 2", quantity: 800, name: "TASTE_2" },
    { title: "Taste 3", quantity: 1000, name: "TASTE_3" },
  ];

  const firstPeltier = [
    { title: "Peltier #1", degrees: 50, name: "PELTIER_1", targetTemp: true },
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
  };

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
