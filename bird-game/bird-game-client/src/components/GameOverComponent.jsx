import React, { useState } from "react";

const GameOverComponent = ({ score, saveScore }) => {
  const [name, setName] = useState(window.localStorage.getItem("name") || "");

  const handleSaveScore = () => {
    if (name === "") return;
    window.localStorage.setItem("name", name);
    saveScore(name);
  };

  return (
    <div className="center">
      <h2>Leik lokið</h2>
      <div>Þú fékkst {score} stig</div>
      <div style={{ marginTop: 15, color: "gray", fontSize: 12 }}>
        Skráðu nafnið þitt að neðan til að vista stigin þín
      </div>
      <input
        value={name}
        placeholder="Nafn"
        className="inp"
        type="text"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button className="btn" onClick={() => handleSaveScore()}>
        Vista stig
      </button>
    </div>
  );
};

export default GameOverComponent;
