import React, { useEffect, useState, useCallback } from "react";
import { Pannellum } from "pannellum-react";

import { CountdownCircleTimer } from "react-countdown-circle-timer";
import {
  CircularProgress,
  ListItemText,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  Button,
  Paper,
} from "@material-ui/core";
import { ChildCare } from "@material-ui/icons";
import "./ImageComponent.css";
import MapComponent from "./MapComponent";
import AppContainer, { useStyles } from "./AppContainer";
import icon from "./icon.png";

const sortPlayersByScore = (players) => {
  return players.sort((a, b) => {
    if (a.score < b.score) return 1;
    if (a.score > b.score) return -1;
    return 0;
  });
};

const ImageComponent = ({ socket }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgUrl, setImgUrl] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [isLeader, setIsLeader] = useState(false);
  const [distance, setDistance] = useState(-1);
  const [roundPosition, setRoundPosition] = useState(undefined);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [countDownKey, setCountDownKey] = useState("countDownTimer");
  const [timePerRound, setTimePerRound] = useState(60);
  const [currentRound, setCurrentRound] = useState(0);
  const [numberOfRounds, setNumberOfRounds] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [guessSent, setGuessSent] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [roundOver, setRoundOver] = useState(false);
  const [playingAgainPressed, setPlayAgainPressed] = useState(false);

  const classes = useStyles();

  const guessSentCallback = () => {
    setImageLoaded(false);
  };

  // 1024 640 or 2048
  const getImageUrlFromKey = (key) => {
    const _imgUrl = `https://images.mapillary.com/${key}/thumb-2048.jpg`;
    // setImgUrl(_imgUrl);
    return _imgUrl;
  };

  const startCountDownTimer = useCallback(() => {
    if (countDownKey === "countDownTimer") {
      setCountDownKey("countDownTimer2");
    } else {
      setCountDownKey("countDownTimer");
    }
    setTimerSeconds(timePerRound);
    setCountdownStarted(true);
  }, [countDownKey, timePerRound]);

  useEffect(() => {
    if (!socket) return;
    socket.on("handleSendImages", (data) => {
      setGameOver(false);
      const { gameData } = data;
      let _players = data["players"];
      _players = sortPlayersByScore(_players);
      const _timePerRound = data["timePerRound"];
      const _currentRound = data["currentRound"];
      const _numberOfRounds = data["numberOfRounds"];
      const _roomName = data["roomName"];
      setRoomName(_roomName);
      setCurrentRound(_currentRound);
      setNumberOfRounds(_numberOfRounds);
      setTimePerRound(_timePerRound);
      setTimerSeconds(_timePerRound);
      setPlayers(_players);
      const myImageUrls = [];
      if (gameData["features"].length > 0) {
        for (let i = 0; i < gameData["features"].length; i++) {
          const item = gameData["features"][i];
          const currKey = item["properties"]["key"];
          const url = getImageUrlFromKey(currKey);
          myImageUrls.push(url);
        }
        setCurrentIndex(0);
        setImageUrls(myImageUrls);
        setImgUrl(myImageUrls[0]);
        setImageLoaded(true);
        setRoundPosition(undefined);
        setDistance(-1);
        setGuessSent(false);
        startCountDownTimer();
        setRoundOver(false);
      }
    });

    socket.on("handleRoundOver", (data) => {
      const { isGameLeader, correctPosition } = data;

      const _distance = data["distance"];
      const _players = data["players"];
      const _playerName = data["playerName"];
      setPlayerName(_playerName);
      setPlayers(_players);
      setRoundPosition(correctPosition);
      setDistance(_distance);

      setIsLeader(isGameLeader);
      setCountdownStarted(false);
      setRoundOver(true);
    });

    socket.on("handleGameOver", (data) => {
      let _players = data["players"];
      _players = sortPlayersByScore(_players);
      setPlayers(_players);
      setGameOver(true);
    });

    socket.on("gameStarted", () => {
      setGameOver(false);
      setDistance(-1);
      setPlayAgainPressed(false);
      setRoundOver(false);
      setRoundPosition(undefined);
    });
  }, [socket, startCountDownTimer]);

  const changeImage = (newIndex) => {
    // delete webGL so its doesn't load stuff we dont want
    const webGLContainer = document.getElementsByClassName(
      "pnlm-render-container"
    )[0];
    while (webGLContainer.childNodes.length > 0) {
      webGLContainer.removeChild(webGLContainer.childNodes[0]);
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

  const handlePlayAgain = () => {
    setPlayAgainPressed(true);
    socket.emit("handleStartGame", { timePerRound, numberOfRounds });
  };

  const PannellumRender = () => {
    return (
      <Pannellum
        width="100%"
        height="500px"
        image={imgUrl}
        pitch={10}
        yaw={180}
        hfov={110}
        compass
        autoLoad
      />
    );
  };

  const RenderPlayAgainBtn = () => {
    if (playingAgainPressed) {
      return (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <Button
        variant="contained"
        onClick={handlePlayAgain}
        className={classes.buttonGreen}
      >
        Play again
      </Button>
    );
  };

  return (
    <AppContainer>
      {gameOver ? (
        <div style={{ textAlign: "center" }}>
          <h3>Game Over</h3>
          {isLeader ? (
            <RenderPlayAgainBtn />
          ) : (
            <Typography>Waiting for leader to start again</Typography>
          )}
        </div>
      ) : (
        <React.Fragment>
          <div
            id="info-container"
            style={{ padding: 15, textAlign: "center", position: "relevant" }}
          >
            <div
              id="count-down-container"
              style={{
                margin: "auto",
                position: "absolute",
                top: 90,
                left: 10,
              }}
            >
              <CountdownCircleTimer
                key={countDownKey}
                isPlaying={countdownStarted}
                size={70}
                duration={timerSeconds}
                colors={[
                  ["#004777", 0.33],
                  ["#F7B801", 0.33],
                  ["#A30000", 0.33],
                ]}
              >
                {({ remainingTime }) => remainingTime}
              </CountdownCircleTimer>
            </div>
            <img className={classes.icon} src={icon} alt="jjicon" />
            <Typography>
              Round {currentRound} of {numberOfRounds}
            </Typography>
          </div>
          {imageUrls.length > 0 ? (
            <div className="pano-container">
              <Typography style={{ textAlign: "center" }}>
                {currentIndex + 1} / {imageUrls.length}{" "}
              </Typography>
              <button
                className="pano-btn"
                id="pano-prev-btn"
                onClick={decIndex}
              >
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
          ) : !guessSent ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress />
            </div>
          ) : (
            <Typography style={{ textAlign: "center" }}>
              Waiting for leader to start round.
            </Typography>
          )}
          <MapComponent
            socket={socket}
            setImageUrls={setImageUrls}
            imageLoaded={imageLoaded}
            guessSentCallback={guessSentCallback}
            isLeader={isLeader}
            distance={distance}
            roundPosition={roundPosition}
            setGuessSent={setGuessSent}
            guessSent={guessSent}
            players={players}
            playerName={playerName}
            roundOver={roundOver}
            setRoundOver={setRoundOver}
          />
        </React.Fragment>
      )}
      {players.length > 0 && (
        <Paper className={classes.cardContainer}>
          <Typography variant="h6">Players in room {roomName}</Typography>
          <List dense={false} style={{ width: 400, margin: "auto" }}>
            <ListItem>
              <ListItemText inset>Name</ListItemText>
              <ListItemText>Score</ListItemText>
            </ListItem>
            {players.map((player, i) => {
              const listBackgroundColor = i % 2 === 0 ? "#ffeeee" : "inherit";
              return (
                <React.Fragment key={`${player.name}-${i}`}>
                  <ListItem style={{ backgroundColor: listBackgroundColor }}>
                    {player.isLeader && (
                      <ListItemIcon>
                        <ChildCare />
                      </ListItemIcon>
                    )}
                    <ListItemText
                      inset={!player.isLeader}
                      primary={player.name}
                    />
                    <ListItemText primary={(+player.score).toLocaleString()} />
                  </ListItem>
                </React.Fragment>
              );
            })}
          </List>
        </Paper>
      )}
    </AppContainer>
  );
};

export default ImageComponent;
