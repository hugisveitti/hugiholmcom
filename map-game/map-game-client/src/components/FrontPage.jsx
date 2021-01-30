import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { waitingPagePath } from "../Routes";

const FrontPage = ({ socket, ...props }) => {
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const handleConnectToRoom = () => {
    if (roomName === "" || playerName === "") return;
    console.log(roomName);
    socket.emit("roomConnection", { roomName, playerName });
    props.history.push(waitingPagePath);
  };

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h2>Map game</h2>
        <p>Still in development</p>
        <p>
          Please write in 'Room Name' anything, then tell your friends to write
          the same thing to play together. Or you can play by yourself.
        </p>
        <p>
          This is in development so there are probably hella bugs. ToDo: add
          leaderboard. Make finding new positions better. Using open street maps
          and Mapillary.
        </p>
        <TextField
          id="player-text-field"
          placeholder="Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <br />
        <br />
        <TextField
          id="room-text-field"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <br />
        <br />
        <Button variant="outlined" onClick={handleConnectToRoom}>
          Connect
        </Button>
      </div>
    </div>
  );
};

export default FrontPage;
