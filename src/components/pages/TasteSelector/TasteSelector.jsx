import { useState } from "react";
import FirstRequest from "../../../functions/FirstRequest";
import "./styles.scss";

export default function TasteSelector() {
  const [information, setInformation] = useState("");

  function firstButton() {
    setInformation("strawberry");
  }

  function secondButton() {
    setInformation("lemon");
  }

  function thirdButton() {
    setInformation("apple");
    FirstRequest("apple");
  }

  console.log(information);

  return (
    <div className="taste-selector-container">
      <div className="buttons">
        <button onClick={() => firstButton()} className="strawberry"></button>
        <button onClick={() => secondButton()} className="lemon"></button>
        <button onClick={() => thirdButton()} className="apple"></button>
      </div>
    </div>
  );
}
