import { frontPagePath } from "../Routes";

export const sortPlayersByScore = (players) => {
  return players.sort((a, b) => {
    if (a.score < b.score) return 1;
    if (a.score > b.score) return -1;
    return 0;
  });
};

// 1024 640 or 2048
const getImageUrlFromKey = (item) => {
  return item["thumb_2048_url"]
  // const _imgUrl = `https://images.mapillary.com/${key}/thumb-2048.jpg`;
  // return _imgUrl;
};

export const watchSendImages = ({
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
}) => {
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
    setImageData(gameData);
    if (gameData.length > 0) {
      for (let i = 0; i < gameData.length; i++) {
        const item = gameData[i];
        //  const currKey = item["properties"]["key"];
        const url = getImageUrlFromKey(item);
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
};

export const watchRoundOver = ({
  socket,
  setPlayerName,
  setPlayers,
  setRoundPosition,
  setDistance,
  setIsLeader,
  setCountdownStarted,
  setRoundOver,
}) => {
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
};

export const playerConnectedCheck = (socket, props) => {
  socket.emit("connectedToAnyRoom");
  socket.on("connectedToAnyRoomCallback", (data) => {
    if (data["playerNotConnectedToGame"]) {
      props.history.push(frontPagePath);
    }
  });
};
