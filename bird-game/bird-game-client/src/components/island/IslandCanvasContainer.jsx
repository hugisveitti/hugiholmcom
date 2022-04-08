import React, { useEffect, useRef, useState } from "react";
import { createIslandCanvas, destroyCanvas } from "./islandCanvas";

const IslandCanvasContainer = () => {
  const ref = useRef();
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const canvas = createIslandCanvas();
    // canvas.setAttribute("style");
    const curr = ref.current;
    curr.appendChild(canvas);

    return () => {
      curr.removeChilde(canvas);
      destroyCanvas();
    };
  }, []);

  const renderInfo = () => {
    return (
      <div
        style={{
          height: !showInfo ? 0 : "auto",
          transition: ".1s",
          display: showInfo ? "block" : "none",
        }}
        className="modal"
      >
        <div style={{}}>
          <button
            className="btn close-btn"
            // style={{ width: 25, height: 25, float: "right" }}
            onClick={() => setShowInfo(false)}
          >
            X
          </button>
          <div>Haltu niðri SHIFT til að hreyfa myndavélina.</div>
          <p>Stærðir á fjöllum hafa verið ýktar.</p>
          <p>Settu músina yfir einhver stað t.d. Langjökul.</p>
          <p>Markmiðið verður að búa til einhvern leik út úr þessu.</p>
          <p>Ég hef ekki lokið við að skrá inn alla staði sem ég vil.</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      {renderInfo()}
      <div style={{ position: "absolute", right: 10, top: 5 }}>
        <button
          className="btn"
          style={{ fontSize: 16, margin: 0, width: 50 }}
          onClick={() => setShowInfo(!showInfo)}
        >
          ?
        </button>
      </div>
      <div ref={ref}></div>
    </div>
  );
};

export default IslandCanvasContainer;
