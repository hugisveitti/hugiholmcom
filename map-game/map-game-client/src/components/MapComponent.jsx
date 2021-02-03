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
  Popup,
} from "react-leaflet";
import { Button, Typography } from "@material-ui/core";
import { useStyles } from "./AppContainer";

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
  players,
  playerName,
  roundOver,
  setRoundOver,
}) => {
  const position = [51.505, -0.09];
  const [markerPos, setMarkerPos] = useState({ lat: 51.505, lng: -0.09 });
  const [oldMarkerPos, setOldMarkerPos] = useState({ lat: 51.505, lng: -0.09 });
  const classes = useStyles();
  const defaultIcon = (correctIcon) =>
    L.icon({
      iconUrl: correctIcon
        ? icon
        : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png",
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [10, 41],
    });

  const otherPlayersIcon = () =>
    L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png",
      // shadowUrl: iconShadow,
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

  const around = (num) => {
    return Math.round(num * 100) / 100;
  };

  const MyMarker = () => {
    useMapEvents({
      click(e) {
        console.log("map clicked", e.latlng);
        let latMax = around(Math.max(e.latlng.lat, markerPos.lat));
        let latMin = around(Math.min(e.latlng.lat, markerPos.lat));
        let lngMax = around(Math.max(e.latlng.lng, markerPos.lng));
        let lngMin = around(Math.min(e.latlng.lng, markerPos.lng));
        console.log(`{ max: ${latMax}, min: ${latMin}, lngIntervals:[
         { min: ${lngMin} , max:${lngMax} }
        ] },`);
        setOldMarkerPos(markerPos);
        if (!roundOver) {
          setMarkerPos({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      },
    });

    return (
      <>
        <Marker icon={defaultIcon(false)} position={markerPos} />
        {roundOver && <CorrectMarker />}
        {roundOver && <LineBetweenMarkers />}
        {players.map((player) => {
          if (player.markerPosition && player.name !== playerName) {
            return (
              <Marker
                icon={otherPlayersIcon()}
                position={player.markerPosition}
                key={player.name}
              >
                <Popup>{player.name}</Popup>
              </Marker>
            );
          }
          return null;
        })}
      </>
    );
  };

  const getCorrectLng = (lng) => {
    let changeValue = 0;
    if (lng < 180) {
      changeValue = 360;
    } else if (lng > 180) {
      changeValue = -360;
    }
    while (Math.abs(lng) > 180) {
      lng += changeValue;
    }
    return lng;
  };

  const handleGuessSent = () => {
    guessSentCallback();
    setGuessSent(true);
    const correctLng = getCorrectLng(+markerPos.lng);
    socket.emit("handleSendGuess", {
      position: { lat: markerPos.lat, lng: correctLng },
    });
  };

  const startNextRound = () => {
    socket.emit("handleStartNextRound", {});
    setImageUrls([]);
    setGuessSent(false);
    setRoundOver(false);
  };

  const StartNextRoundButton = () => {
    if ((guessSent && roundPosition) || roundOver) {
      if (isLeader) {
        return (
          <div style={{ textAlign: "center" }}>
            <Button
              onClick={startNextRound}
              variant="contained"
              className={classes.buttonGreen}
            >
              Start next round
            </Button>
          </div>
        );
      } else {
        return (
          <div style={{ textAlign: "center" }}>
            <Typography>Waiting for leader to start next round</Typography>
          </div>
        );
      }
    }

    return null;
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
        bounds={L.latLngBounds(L.latLng(90, 180), L.latLng(-90, -180))}
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
            <Typography style={{ textAlign: "center", paddingBottom: 20 }}>
              You were {distance.toLocaleString()} KM from the correct position.
            </Typography>
          ) : (
            <Typography style={{ textAlign: "center", paddingBottom: 20 }}>
              You did not guess this round.
            </Typography>
          )}
        </React.Fragment>
      )}
      {imageLoaded && !roundPosition && (
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={handleGuessSent}
            variant="contained"
            className={classes.greenButton}
          >
            Send
          </Button>
        </div>
      )}
      {guessSent && !roundPosition && (
        <div style={{ textAlign: "center", paddingBottom: 20 }}>
          <Typography>Waiting for other players to finish.</Typography>
        </div>
      )}
      <StartNextRoundButton />
    </div>
  );
};

export default MapComponent;
