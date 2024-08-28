import { useState } from "react";
import machineProcess from "../../../functions/machineProcess";
import "./styles.scss";

export default function TasteSelector() {

  function firstButton() {
    machineProcess("strawberry");
  }

  function secondButton() {
    machineProcess("lemon");
  }

  function thirdButton() {
    machineProcess("apple");
  }

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
