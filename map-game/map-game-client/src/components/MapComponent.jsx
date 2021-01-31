import React, { useState } from "react";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Polyline,
} from "react-leaflet";
import { Button, Typography } from "@material-ui/core";

const MapComponent = ({
  socket,
  setImageUrls,
  imageLoaded,
  guessSentCallback,
  isLeader,
  distance,
  roundPosition,
  setGuessSent,
  guessSent,
}) => {
  const position = [51.505, -0.09];
  const [markerPos, setMarkerPos] = useState({ lat: 51.505, lng: -0.09 });

  const defaultIcon = (correctIcon) =>
    L.icon({
      iconUrl: correctIcon
        ? icon
        : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [10, 41],
    });

  const CorrectMarker = () => {
    if (!roundPosition) return null;
    return <Marker icon={defaultIcon(true)} position={roundPosition} />;
  };

  const LineBetweenMarkers = () => {
    if (!roundPosition) return null;
    return (
      <Polyline
        positions={[
          [roundPosition.lat, roundPosition.lng],
          [markerPos.lat, markerPos.lng],
        ]}
      />
    );
  };

  const MyMarker = () => {
    useMapEvents({
      click(e) {
        console.log("map clicked", e.latlng);
        setMarkerPos({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });

    return (
      <>
        <Marker icon={defaultIcon(false)} position={markerPos} />
        <CorrectMarker />
        <LineBetweenMarkers />
      </>
    );
  };

  const handleGuessSent = () => {
    guessSentCallback();
    setGuessSent(true);
    socket.emit("handleSendGuess", {
      position: { lat: markerPos.lat, lng: markerPos.lng },
    });
  };

  const startNextRound = () => {
    socket.emit("handleStartNextRound", {});
    setImageUrls([]);
    // setRoundPosition(undefined);
    setGuessSent(false);
    // setDistance(-1);
  };
  return (
    <div style={{ padding: 20 }}>
      <MapContainer
        center={position}
        zoom={2}
        style={{
          height: 400,
          width: "70%",
          margin: "auto",
          marginBottom: 15,
        }}
      >
        <MyMarker />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png"
        />
      </MapContainer>
      {roundPosition && (
        <React.Fragment>
          {distance !== -1 ? (
            <Typography style={{ textAlign: "center" }}>
              You were {distance.toLocaleString()} KM from the correct position.
            </Typography>
          ) : (
            <Typography style={{ textAlign: "center" }}>
              You did not guess this round.
            </Typography>
          )}
        </React.Fragment>
      )}

      {imageLoaded && !roundPosition && (
        <div style={{ textAlign: "center", paddingBottom: 20 }}>
          <Button onClick={handleGuessSent} variant="contained">
            Send
          </Button>
        </div>
      )}
      {guessSent && !roundPosition && (
        <div style={{ textAlign: "center" }}>
          <Typography>Waiting for other players to finish.</Typography>
        </div>
      )}
      {guessSent && roundPosition && (
        <React.Fragment>
          {isLeader ? (
            <div style={{ textAlign: "center", paddingBottom: 20 }}>
              <Button onClick={startNextRound} variant="contained">
                Start next round
              </Button>
            </div>
          ) : (
            <div style={{ textAlign: "center", paddingBottom: 20 }}>
              <Typography>Waiting for leader to start next round</Typography>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default MapComponent;
