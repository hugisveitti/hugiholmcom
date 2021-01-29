import React, { useEffect, useState } from "react";
import { Pannellum } from "pannellum-react";
import "./ImageComponent.css";
import { CircularProgress, Typography } from "@material-ui/core";

const ImageComponent = ({ socket }) => {
  const getImage = (imageKey) => {
    socket.emit("getImageData", { imageKey });
    socket.on("getImage", (data) => {
      console.log("image data", data);
    });
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  // 1024 640 or 2048
  const getImageUrlFromKey = (key) => {
    const _imgUrl = `https://images.mapillary.com/${key}/thumb-2048.jpg`;
    // setImgUrl(_imgUrl);
    return _imgUrl;
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("sendSequence", (data) => {
      const myImageUrls = [];
      if (data["features"].length > 0) {
        for (let i = 0; i < data["features"].length; i++) {
          const item = data["features"][i];
          const currKey = item["properties"]["key"];
          const url = getImageUrlFromKey(currKey);
          myImageUrls.push(url);
        }
        setImageUrls(myImageUrls);
        setImgUrl(myImageUrls[0]);
      }
    });
  }, [socket]);

  const changeImage = (newIndex) => {
    console.log("currentIndex", newIndex);
    console.log(imageUrls[newIndex]);
    setImgUrl(imageUrls[newIndex]);
  };

  const incIndex = () => {
    let newIndex = -1;
    if (currentIndex === imageUrls.length - 1) {
      setCurrentIndex(0);
      newIndex = 0;
    } else {
      setCurrentIndex(currentIndex + 1);
      newIndex = currentIndex + 1;
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

  return (
    <div>
      <h4>Image component</h4>
      {imageUrls.length > 0 ? (
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

          <Pannellum
            width="100%"
            height="500px"
            image={imgUrl}
            pitch={10}
            yaw={180}
            hfov={110}
            autoLoad
            onLoad={() => {
              console.log("panorama loaded");
            }}
          />
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default ImageComponent;
