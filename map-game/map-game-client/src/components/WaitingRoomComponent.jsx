import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper,
} from "@material-ui/core";
import { ChildCare } from "@material-ui/icons";
import { gamePagePath } from "../Routes";
import AppContainer, { useStyles } from "./AppContainer";

const WaitingRoomComponent = ({ socket, ...props }) => {
  const [roomName, setRoomName] = useState("");
  const [players, setPlayers] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [numberOfRounds, setNumberOfRounds] = useState(5);
  const [timePerRound, setTimePerRound] = useState(60);
  const [onlyPano, setOnlyPano] = useState(true);
  const [onlyEuropeUsa, setOnlyEuropeUsa] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (socket) {
      socket.emit("connectedToWaitingRoom");
      socket.once("connectedToWaitingRoomCallback", (data) => {
        const _roomName = data["roomName"];
        const _players = data["players"];
        const _isLeader = data["isLeader"];
        setRoomName(_roomName);
        setIsLeader(_isLeader);
        setPlayers(_players);
      });

      socket.on("updatePlayers", (data) => {
        const _players = data["players"];
        if (_players) {
          setPlayers(_players);
        }
      });

      socket.on("gameStarted", () => {
        props.history.push(gamePagePath);
      });
    }
  }, [socket, props.history]);

  const handleStartGame = () => {
    if (!isNaN(+timePerRound) && !isNaN(+numberOfRounds)) {
      socket.emit("handleStartGame", {
        timePerRound,
        numberOfRounds,
        onlyPano,
        onlyEuropeUsa,
      });
    }
  };

  return (
    <AppContainer>
      <Paper elevation={1} className={classes.cardContainer}>
        <h3>Waiting room</h3>
        <h5>Room {roomName}</h5>
        <Typography>
          To play with your friends, tell them to write '{roomName}' in the room
          inputbox and press connect!
        </Typography>
        <Typography>Players in room</Typography>
        <List style={{ width: 200, margin: "auto" }}>
          {players.map((player, i) => {
            return (
              <React.Fragment key={`${player.name}-${i}`}>
                <ListItem>
                  <ListItemText>{player.name}</ListItemText>
                  {player.isLeader ? (
                    <ListItemIcon>
                      <ChildCare />
                    </ListItemIcon>
                  ) : (
                    <ListItemText />
                  )}
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
        {isLeader ? (
          <React.Fragment>
            <br />
            <br />
            <Typography>Number of Rounds</Typography>
            <TextField
              id="numberofrounds-text-field"
              type="number"
              placeholder="Number of rounds"
              value={numberOfRounds}
              onChange={(e) => setNumberOfRounds(e.target.value)}
            />
            <br />
            <br />
            <Typography>Seconds per round</Typography>
            <TextField
              id="timeperround-text-field"
              type="number"
              placeholder="seconds per round"
              value={timePerRound}
              onChange={(e) => setTimePerRound(e.target.value)}
            />
            <br />
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={onlyPano}
                  onChange={() => {
                    setOnlyPano(!onlyPano);
                  }}
                />
              }
              label="Use only panoramas?"
            />
            <br />
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  value={onlyEuropeUsa}
                  onChange={() => setOnlyEuropeUsa(!onlyEuropeUsa)}
                />
              }
              label="Use only 40+ latitude?"
            />
            <br />
            <br />
            <Button
              onClick={handleStartGame}
              variant="contained"
              className={classes.buttonGreen}
            >
              Start Game
            </Button>
          </React.Fragment>
        ) : (
          <Typography>Waiting for leader to start the game.</Typography>
        )}
      </Paper>
    </AppContainer>
  );
};

export default WaitingRoomComponent;
