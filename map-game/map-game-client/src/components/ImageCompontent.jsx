import React, { useEffect, useState } from "react";
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
} from "@material-ui/core";
import { ChildCare } from "@material-ui/icons";
import "./ImageComponent.css";
import MapComponent from "./MapComponent";

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

  const changeCountdownKey = () => {
    if (countDownKey === "countDownTimer") {
      setCountDownKey("countDownKey");
    } else {
      setCountDownKey("countDownTimer");
    }
    setTimerSeconds(timePerRound);
  };

  const guessSentCallback = () => {
    setImageLoaded(false);
    setCountdownStarted(false);
    changeCountdownKey();
  };

  // 1024 640 or 2048
  const getImageUrlFromKey = (key) => {
    const _imgUrl = `https://images.mapillary.com/${key}/thumb-2048.jpg`;
    // setImgUrl(_imgUrl);
    return _imgUrl;
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("handleSendImages", (data) => {
      setGameOver(false);
      const { gameData } = data;
      const _players = data["players"];
      const _timePerRound = data["timePerRound"];
      const _currentRound = data["currentRound"];
      const _numberOfRounds = data["numberOfRounds"];
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
        setCountdownStarted(true);
        setRoundPosition(undefined);
        setDistance(-1);
        changeCountdownKey();
        setGuessSent(false);
      }
    });

    socket.on("handleRoundOver", (data) => {
      const { isGameLeader, correctPosition } = data;

      const _distance = data["distance"];
      setRoundPosition(correctPosition);
      setDistance(_distance);
      setGuessSent(true);
      setIsLeader(isGameLeader);
      setImageUrls([]);
    });

    socket.on("handleGameOver", (data) => {
      const _players = data["players"];
      setPlayers(_players);
      setGameOver(true);
    });
  }, [socket]);

  const changeImage = (newIndex) => {
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
    socket.emit("handleStartGame", { timePerRound, numberOfRounds });
  };

  return (
    <div>
      {gameOver ? (
        <div style={{ textAlign: "center" }}>
          <h3>Game Over</h3>
          {isLeader ? (
            <Button variant="outlined" onClick={handlePlayAgain}>
              Play again
            </Button>
          ) : (
            <Typography>Waiting for leader to start again</Typography>
          )}
        </div>
      ) : (
        <React.Fragment>
          <div id="countdown-clock-container" style={{ margin: "auto" }}>
            <CountdownCircleTimer
              key={countDownKey}
              isPlaying={countdownStarted}
              style={{ margin: "auto" }}
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
          <Typography>
            Round {currentRound} of {numberOfRounds}
          </Typography>
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

              <Pannellum
                width="100%"
                height="500px"
                image={imgUrl}
                pitch={10}
                yaw={180}
                hfov={110}
                autoLoad
              />
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <CircularProgress />
            </div>
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
          />
        </React.Fragment>
      )}
      {players.length > 0 && (
        <div style={{ textAlign: "center" }}>
          <Typography>Players in room</Typography>
          <List style={{ width: 200, margin: "auto" }}>
            <ListItem>
              <ListItemText>Score</ListItemText>
              <ListItemText>Name</ListItemText>
              <ListItemText></ListItemText>
            </ListItem>
            {players.map((player, i) => {
              return (
                <React.Fragment key={`${player.name}-${i}`}>
                  <ListItem>
                    <ListItemText>{player.score}</ListItemText>
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
        </div>
      )}
    </div>
  );
};

export default ImageComponent;
