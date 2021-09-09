import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { waitingPagePath } from "../Routes";
import AppContainer, { useStyles } from "./AppContainer";
import icon from "./icon.png";
import DonateButton from "./DonateButton";

const FrontPage = ({ socket, ...props }) => {
  const classes = useStyles();
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackStatus, setSnackStatus] = useState("");

  useEffect(() => {
    if (!socket) return;
  }, [socket]);

  const handleConnectToRoom = () => {
    if (roomName === "" || playerName === "") {
      setSnackOpen(true);
      setSnackStatus("error");
      setSnackMessage("Please fill in your name and room name");
      return;
    }
    socket.emit("roomConnection", { roomName, playerName });
    socket.on("roomConnectionCallback", (data) => {
      setSnackMessage(data["message"]);
      setSnackStatus(data["status"]);
      setSnackOpen(true);
      if (data["status"] === "success") {
        props.history.push(waitingPagePath);
      }
    });
  };

  return (
    <AppContainer>
      <Snackbar
        open={snackOpen}
        autoHideDuration={5000}
        onClose={() => setSnackOpen(false)}
      >
        <Alert
          elevation={6}
          variant="filled"
          severity={snackStatus}
          onClose={() => setSnackOpen(false)}
        >
          {snackMessage}
        </Alert>
      </Snackbar>
      <div style={{ textAlign: "center" }}>
        <img className={classes.icon} src={icon} alt="joejuessrlogo" />
        <Card className={classes.cardContainer}>
          <CardContent>
            <p>Still in development</p>
            <p>
              Please write in 'Room Name' anything, then tell your friends to
              write the same thing to play together. Or you can play by
              yourself.
            </p>
            <p>
              This is in development so there are probably hella bugs. ToDo: add
              leaderboard. Make finding new positions better. Using open street
              maps and Mapillary.
            </p>
            <p>
              It is possible to reconnect to a game by writing the exact same
              name.
            </p>

            <h3>
              I have noticed that people still play this game even though I have
              not advertised it. That is why I have set up a link to accept
              donations, with that I will continue to develop the game, put it
              on a better server (it will be faster) and even take some
              requests.
            </h3>
            <DonateButton />
            <br />

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
            <Button
              className={classes.buttonGreen}
              variant="contained"
              onClick={handleConnectToRoom}
            >
              Connect
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppContainer>
  );
};

export default FrontPage;
