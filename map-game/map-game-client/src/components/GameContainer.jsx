import React, { useEffect, useState, useCallback } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { CircularProgress, Typography, Button } from "@material-ui/core";
import {
  watchSendImages,
  watchRoundOver,
  sortPlayersByScore,
} from "../utility/socketFunctions";

import "./GameContainer.css";
import MapComponent from "./MapComponent";
import AppContainer, { useStyles } from "./AppContainer";
import icon from "./icon.png";
import PanoramaComponent from "./PanoramaComponent";
import LeaderBoardComponent from "./LeaderBoardComponent";
import { playerConnectedCheck } from "../utility/socketFunctions";

const GameContainer = ({ socket, ...props }) => {
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
  const [imageData, setImageData] = useState([]);

  const classes = useStyles();

  const guessSentCallback = () => {
    setImageLoaded(false);
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

    playerConnectedCheck(socket, props);

    watchSendImages({
      socket,
      setGameOver,
      setRoomName,
      setCurrentRound,
      setNumberOfRounds,
      setTimePerRound,
      setTimerSeconds,
      setPlayers,
      setCurrentIndex,
      setImageUrls,
      setImgUrl,
      setImageLoaded,
      setDistance,
      setGuessSent,
      startCountDownTimer,
      setRoundOver,
      setRoundPosition,
      setImageData,
    });

    watchRoundOver({
      socket,
      setPlayerName,
      setPlayers,
      setRoundPosition,
      setDistance,
      setIsLeader,
      setCountdownStarted,
      setRoundOver,
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

  const handlePlayAgain = () => {
    setPlayAgainPressed(true);
    socket.emit("handleStartGame", { timePerRound, numberOfRounds });
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
          <PanoramaComponent
            imgUrl={imgUrl}
            imageUrls={imageUrls}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            setImgUrl={setImgUrl}
            guessSent={guessSent}
            imageData={imageData}
          />
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
        <LeaderBoardComponent players={players} roomName={roomName} />
      )}
    </AppContainer>
  );
};

export default GameContainer;
