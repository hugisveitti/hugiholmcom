import React from "react";

const GameTypeSelect = ({ onSelect }) => {
  return (
    <div className="center">
      <h5>Veldu leik</h5>
      <button
        className="btn"
        style={{ marginRight: 15 }}
        onClick={() => onSelect("bird")}
      >
        Fuglar
      </button>
      <button className="btn" onClick={() => onSelect("plant")}>
        Plöntur
      </button>
    </div>
  );
};

export default GameTypeSelect;
