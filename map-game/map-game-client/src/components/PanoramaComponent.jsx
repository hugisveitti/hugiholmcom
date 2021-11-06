import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@material-ui/core";
import "./GameContainer.css";
import { Viewer } from "photo-sphere-viewer";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";

const PanoramaComponent = ({
  imageUrls,

  currentIndex,
  setCurrentIndex,

  guessSent,
  imageData,
}) => {
  const [viewer, setViewer] = useState(undefined);
  const spehereRef = React.createRef();

  const changeImage = (newIndex) => {
    // delete webGL so its doesn't load stuff we dont want

    if (viewer) {
      viewer.setPanorama(imageUrls[newIndex]).then(
        () => {},
        (e) => {
          console.log("error", e);
        }
      );
    }
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

  useEffect(() => {
    if (imageUrls.length > 0) {
      if (!viewer) {
        const viewer2 = new Viewer({
          container: spehereRef.current,
          panorama: imageUrls[0],
          navbar: false,
          loadingTxt: "",
        });
        setViewer(viewer2);
      } else {
        changeImage(0);
      }
    }
  }, [imageUrls?.length]);

  const displayPano = imageUrls.length > 0 ? "block" : "none";
  return (
    <React.Fragment>
      <div className="pano-container" style={{ display: displayPano }}>
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
        <div
          style={{ height: 400, width: "100%" }}
          id="viewer"
          ref={spehereRef}
        ></div>
      </div>
      <div style={{ display: imageUrls.length > 0 ? "none" : "block" }}>
        {!guessSent ? (
          <div style={{ textAlign: "center" }}>
            <CircularProgress />
            <div>Loading image...</div>
          </div>
        ) : (
          <Typography style={{ textAlign: "center" }}>
            Waiting for leader to start round.
          </Typography>
        )}
      </div>
    </React.Fragment>
  );
};

export default PanoramaComponent;
