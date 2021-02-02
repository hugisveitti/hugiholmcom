import React, { useRef } from "react";
import { Pannellum } from "pannellum-react";
import { Typography, CircularProgress } from "@material-ui/core";
import "./GameContainer.css";

const PanoramaComponent = ({
  imageUrls,
  imgUrl,
  currentIndex,
  setCurrentIndex,
  setImgUrl,
  guessSent,
}) => {
  const panoRef = useRef();
  const handlePanoLoad = () => {
    console.log("pano loaded");
    // panoRef?.current?.panorama.loadScene();
  };

  const changeImage = (newIndex) => {
    // delete webGL so its doesn't load stuff we dont want
    const webGLContainer = document.getElementsByClassName(
      "pnlm-render-container"
    )[0];

    while (webGLContainer.childNodes.length > 0) {
      webGLContainer.removeChild(webGLContainer.childNodes[0]);
    }
    if (panoRef?.current) {
      console.log("destroying context");
      panoRef.current.panorama.destroy();
    }

    setImgUrl(imageUrls[newIndex]);
  };

  const incIndex = () => {
    let newIndex = -1;
    if (currentIndex === imageUrls.length - 1) {
      newIndex = 0;
      setCurrentIndex(0);
    } else {
      newIndex = currentIndex + 1;
      setCurrentIndex(currentIndex + 1);
    }
    changeImage(newIndex);
  };

  const decIndex = () => {
    let newIndex = -1;
    if (currentIndex === 0) {
      setCurrentIndex(imageUrls.length - 1);
      newIndex = imageUrls.length - 1;
    } else {
      setCurrentIndex(currentIndex - 1);
      newIndex = currentIndex - 1;
    }
    changeImage(newIndex);
  };

  const PannellumRender = () => {
    return (
      <Pannellum
        ref={panoRef}
        width="100%"
        height="500px"
        image={imgUrl}
        pitch={10}
        yaw={180}
        hfov={110}
        compass
        autoLoad
        onLoad={handlePanoLoad}
      />
    );
  };

  if (imageUrls.length > 0) {
    return (
      <div className="pano-container">
        <Typography style={{ textAlign: "center" }}>
          {currentIndex + 1} / {imageUrls.length}{" "}
        </Typography>
        <button className="pano-btn" id="pano-prev-btn" onClick={decIndex}>
          <i className="arrow arrow-left"></i>
        </button>
        <button
          className="pano-btn arrow-right"
          id="pano-next-btn"
          onClick={incIndex}
        >
          <i className="arrow"></i>
        </button>
        <PannellumRender />
      </div>
    );
  }

  if (!guessSent) {
    return (
      <div style={{ textAlign: "center" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Typography style={{ textAlign: "center" }}>
      Waiting for leader to start round.
    </Typography>
  );
};

export default PanoramaComponent;
