import React from "react";
import IslandCanvasContainer from "./IslandCanvasContainer";
import "./island.css";

const IslandFrontPage = () => {
  return (
    <div
      className="container"
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "rosybrown",
      }}
    >
      <IslandCanvasContainer />
    </div>
  );
};

export default IslandFrontPage;
