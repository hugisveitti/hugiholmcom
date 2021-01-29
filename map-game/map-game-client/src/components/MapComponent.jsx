import React, { useEffect, useState } from "react";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { Button, Typography } from "@material-ui/core";

const MapComponent = ({ socket }) => {
  const position = [51.505, -0.09];
  const [markerPos, setMarkerPos] = useState([51.505, -0.09]);

  const [distance, setDistance] = useState(-1);
  const [roundPosition, setRoundPosition] = useState(undefined);

  useEffect(() => {
    if (!socket) return;
    socket.on("handleCorrectPosition", (data) => {
      setDistance(+data["distance"]);
      setRoundPosition(data["correctPosition"]);
    });
  }, [socket]);
  const defaultIcon = (color) =>
    L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      html: `<span style="background-color:${color}" />`,
    });

  const MyMarker = () => {
    useMapEvents({
      click(e) {
        console.log("map cliiiick", e);
        setMarkerPos([e.latlng.lat, e.latlng.lng]);
      },
    });
    return <Marker icon={defaultIcon("blue")} position={markerPos} />;
  };

  const CorrectMarker = () => {
    if (!roundPosition) return null;
    return <Marker icon={defaultIcon("green")} position={roundPosition} />;
  };

  const handleGuessSent = () => {
    socket.emit("handleSendGuess", {
      position: { lat: markerPos[0], lng: markerPos[1] },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <MapContainer
        center={position}
        zoom={2}
        style={{
          height: 400,
          width: "70%",
          // minWidth: 275,
          margin: "auto",
          marginBottom: 15,
        }}
      >
        <MyMarker />
        <CorrectMarker />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
      {distance !== -1 && (
        <Typography style={{ textAlign: "center" }}>
          You were {distance.toLocaleString()} KM from the correct position.
        </Typography>
      )}
      <div style={{ textAlign: "center", paddingBottom: 20 }}>
        <Button onClick={handleGuessSent} variant="contained">
          Send
        </Button>
      </div>
    </div>
  );
};

export default MapComponent;
