import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firstImage from "./../../../assets/img/images-1.png";
import "./styles.scss";

export default function BootStandBy() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  console.log(loading);

  /* 
   you will make de request you want and you will stop de loading by turning it to false, and then you can do the route change like

  const machineProcess = () =>
    // after the success of the request you turn the loading off
    setLoading(false);

  useEffect(() => {
    machineProcess();
  }, []);

  useEffect(() => {
    if (!loading) navigate("/taste-selector");
  }, [loading]);
  };

  */

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      navigate("/taste-selector");
    }, 5000);
  }, []);

  return (
    <div className="boot-standby-container">
      <img src={firstImage} />
    </div>
  );
}
