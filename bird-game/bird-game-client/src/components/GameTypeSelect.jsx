import React, { useState } from "react";

const GameTypeSelect = ({ onSelect, inGame, perc, setPerc }) => {
  const [val, setVal] = useState(perc);
  if (inGame) return null;

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
      <button
        className="btn"
        style={{ marginRight: 15 }}
        onClick={() => onSelect("plant")}
      >
        Plöntur
      </button>
      <button
        style={{ marginRight: 15 }}
        className="btn"
        onClick={() => onSelect("geo")}
      >
        Landafræði
      </button>
      <button className="btn">
        <a href="/island" style={{ textDecoration: "none", color: "black" }}>
          Skoða ísland
        </a>
      </button>
      <br />
      <label>Spila {val} % </label>
      <input
        type="range"
        width="200"
        className="range"
        step={5}
        min={5}
        value={val}
        max={100}
        onBlur={(e) => {
          setPerc(val);
        }}
        onChange={(e) => {
          setVal(e.target.value);
        }}
      />
    </div>
  );
};

export default GameTypeSelect;
