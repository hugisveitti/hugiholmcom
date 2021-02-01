const request = require("request");
const uuid = require("uuid").v4;

const { worldMapSplits } = require("./map-game-positions");

const options = (url) => ({
  dataType: "json",
  type: "Get",
  url,
});

function distance(lat1, lon1, lat2, lon2, unit) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") {
      dist = dist * 1.609344;
    }
    if (unit == "N") {
      dist = dist * 0.8684;
    }
    return dist;
  }
}

const mapillaryAPIKey = "QXhncjROZWhWZWRIYW8wMnZFYjNEWTo1ZGQwZDRkYzQwMzAyNDZj";

const getRandomRange = (max, min) => {
  return Math.random() * (max - min) + min;
};

const getRandomLatLng = (game) => {
  // europe
  let indexSearchLength = worldMapSplits.length;
  if (game.onlyEuropeUsa) {
    indexSearchLength = 3;
  }
  const latIndex = Math.floor(Math.random() * indexSearchLength);
  const lngIndex = Math.floor(
    Math.random() * worldMapSplits[latIndex].lngIntervals.length
  );

  const latRange = worldMapSplits[latIndex];
  const lngRange = worldMapSplits[latIndex].lngIntervals[lngIndex];
  const lng = getRandomRange(lngRange.max, lngRange.min);
  const lat = getRandomRange(latRange.max, latRange.min);
  return { lat, lng };
};

const getSequence = (game, callBack) => {
  // min_longitude,min_latitude,max_longitude,max_latitu
  let { lat, lng } = getRandomLatLng(game);
  let perpage = "per_page=4";
  // not only use panos
  const pano = `pano=${game.onlyPano}`;
  // const bbox = `bbox=${lng},${lat},${lng + 2},${lat + 2}`;
  // 100 km
  let radius = "radius=1000000";
  const getImageWithLatLng = (myLat, myLng, imageKnown, radius_meters) => {
    radius = `radius=${radius_meters}`;
    if (imageKnown) {
      // 10 km
      radius = "radius=10000";
      perpage = "per_page=50";
    }
    console.log("radius", radius);
    const bbox = `closeto=${myLng},${myLat}`;
    const url = `https://a.mapillary.com/v3/images?${bbox}&${pano}&min_quality_score=3&${perpage}&${radius}&client_id=${mapillaryAPIKey}`;
    request(options(url), (err, apiRes, body) => {
      const data = JSON.parse(body);
      console.log("number of images at location", data["features"].length);
      if (data["features"].length < 3) {
        console.log("not enough data on", "lat:", myLat, ", lng:", myLng);
        const newCoor = getRandomLatLng(game);
        // increase search space, so loading isnt long
        getImageWithLatLng(newCoor.lat, newCoor.lng, false, radius_meters * 10);
      } else if (!imageKnown) {
        const coor = data["features"][0]["geometry"]["coordinates"];
        getImageWithLatLng(coor[1], coor[0], true, 10000);
      } else {
        console.log("place at lat lag", myLat, myLng);
        // socket.emit("sendSequence", data);
        game.setCurrentGameData(data);
        game.setCurrentPosition(myLat, myLng);
        callBack();
      }
    });
  };
  getImageWithLatLng(lat, lng, false, 1000000);
};

class Player {
  constructor(socket, playerName) {
    this.score = 0;
    this.currentGuess = { lat: 0, lng: 0 };
    this.socket = socket;
    this.playerName = playerName;
    this.game = undefined;
    this.handleGuess();
    this.watchGetNextRound();
    this.connectedToWaitingRoom();
    this.isGameLeader = false;
    this.playerIndex = -1;
    this.roundGuessGotten = false;
    this.lastDistance = -1;
    this.disconnected = false;
  }

  handleStartGame() {
    if (this.isGameLeader) {
      this.socket.on("handleStartGame", (data) => {
        const { timePerRound, numberOfRounds, onlyPano, onlyEuropeUsa } = data;
        this.game.startGame(
          timePerRound,
          numberOfRounds,
          onlyPano,
          onlyEuropeUsa
        );
      });
    }
  }

  setIsGameLeader() {
    this.isGameLeader = true;
  }

  connectedToWaitingRoom() {
    this.socket.once("connectedToWaitingRoom", () => {
      this.socket.emit("connectedToWaitingRoomCallback", {
        roomName: this.game.roomName,
        players: this.game.playerNames,
        isLeader: this.isGameLeader,
      });
    });
  }

  handleGuess() {
    this.socket.on("handleSendGuess", (data) => {
      console.log("guess received", data);
      const currentDistance = Math.floor(
        this.game.calculateDistance(data.position.lat, data.position.lng)
      );
      this.roundGuessGotten = true;
      this.lastDistance = currentDistance;
      this.score += Math.max(this.game.maxScore - currentDistance, 0);
      this.game.playerNames[this.playerIndex].score = this.score;
      this.game.playerNames[this.playerIndex].markerPosition = data.position;
      this.game.addPlayerGuessed(this);
    });
  }

  watchGetNextRound() {
    this.socket.on("handleStartNextRound", (data) => {
      this.game.getNextRandomPosition();
    });
  }

  setGame(game) {
    this.game = game;
  }

  handleRoundOver() {
    this.socket.emit("handleRoundOver", {
      isGameLeader: this.isGameLeader,
      distance: this.lastDistance,
      correctPosition: this.game.currentPosition,
      players: this.game.playerNames,
      playerName: this.playerName,
    });
    this.lastDistance = -1;
  }

  resetGameMarketPosition() {
    this.game.playerNames[this.playerIndex].markerPosition = undefined;
  }

  resetScore() {
    this.score = 0;
    this.game.playerNames[this.playerIndex].score = 0;
  }
}

class MapGame {
  constructor(io, socket, roomName) {
    this.players = {};
    this.numberOfRounds = 5;
    this.currentRound = 0;
    this.currentPosition = { lat: 0, lng: 0 };
    this.io = io;
    this.socket = socket;
    this.gameStarted = false;
    this.leader = undefined;
    this.gameFinished = false;
    this.roomName = roomName;
    this.playerNames = [];
    this.timePerRound = 60;
    this.currentGameData = undefined;
    this.maxScore = 5000;
    this.playersGuessed = [];
    this.timeoutFunction = undefined;
    this.onlyPano = true;
    this.onlyEuropeUsa = false;
  }

  // check if game has player with that name
  createPlayer(playerName, socket) {
    const playerIds = Object.keys(this.players);
    for (let i = 0; i < playerIds.length; i++) {
      const currPlayer = this.players[playerIds[i]];
      if (currPlayer.playerName === playerName) {
        if (currPlayer.disconnected) {
          currPlayer.socket = socket;
          currPlayer.disconnected = false;
          if (this.gameStarted) {
            socket.emit("gameStarted", {});
            socket.emit("handleSendImages", {
              gameData: this.currentGameData,
              players: this.playerNames,
              timePerRound: this.timePerRound,
              currentRound: this.currentRound,
              numberOfRounds: this.numberOfRounds,
              // time left not correct
            });
          }
          return currPlayer;
        } else {
          // player name in use and connected
          return undefined;
        }
      }
    }
    const player = new Player(socket, playerName);
    this.addPlayer(player);
    player.setGame(this);
    return player;
  }

  sendRoundOverToPlayers() {
    const playerKeys = Object.keys(this.players);
    for (let i = 0; i < playerKeys.length; i++) {
      this.players[playerKeys[i]].handleRoundOver();
    }
  }

  resetPlayersMarketPositions() {
    const playerKeys = Object.keys(this.players);
    for (let i = 0; i < playerKeys.length; i++) {
      this.players[playerKeys[i]].resetGameMarketPosition();
    }
  }

  resetPlayersScore() {
    const playerKeys = Object.keys(this.players);
    for (let i = 0; i < playerKeys.length; i++) {
      this.players[playerKeys[i]].resetScore();
    }
  }

  addPlayerGuessed(player) {
    console.log("add player guessed");
    this.playersGuessed.push(player);
    if (this.playersGuessed.length === this.playerNames.length) {
      clearTimeout(this.timeoutFunction);
      this.sendRoundOverToPlayers();
    }
  }

  setCurrentGameData(data) {
    this.currentGameData = data;
  }

  calculateDistance(lat, lng) {
    return distance(
      lat,
      lng,
      this.currentPosition.lat,
      this.currentPosition.lng,
      "K"
    );
  }

  setCurrentPosition(lat, lng) {
    this.currentPosition.lat = lat;
    this.currentPosition.lng = lng;
  }

  monitorTime() {
    this.timeoutFunction = setTimeout(() => {
      console.log("times up!");
      this.sendRoundOverToPlayers();
    }, (this.timePerRound + 1) * 1000);
  }

  gameOver() {
    this.io
      .to(this.roomName)
      .emit("handleGameOver", { players: this.playerNames });
  }

  startRound() {
    this.playersGuessed = [];
    console.log("start round");
    this.resetPlayersMarketPositions();

    this.io.to(this.roomName).emit("handleSendImages", {
      gameData: this.currentGameData,
      players: this.playerNames,
      timePerRound: this.timePerRound,
      currentRound: this.currentRound,
      numberOfRounds: this.numberOfRounds,
      roomName: this.roomName,
    });
    this.monitorTime();
  }

  getNextRandomPosition() {
    this.currentRound++;
    if (this.currentRound > this.numberOfRounds) {
      console.log("game over");
      this.gameOver();
    } else {
      getSequence(this, () => {
        this.startRound();
      });
    }
  }

  sendUpdatePlayerList() {
    console.log("send updateplayer list", this.playerNames);
    this.io
      .to(this.roomName)
      .emit("updatePlayers", { players: this.playerNames });
  }

  startGame(timePerRound, numberOfRounds, onlyPano, onlyEuropeUsa) {
    this.currentRound = 0;
    if (onlyPano !== undefined) {
      this.onlyPano = onlyPano;
    }
    if (onlyEuropeUsa !== undefined) {
      this.onlyEuropeUsa = onlyEuropeUsa;
    }
    this.resetPlayersScore();

    this.timePerRound = +timePerRound;
    this.numberOfRounds = +numberOfRounds;
    this.gameStarted = true;
    console.log("game started");
    this.io.to(this.roomName).emit("gameStarted");
    this.getNextRandomPosition();
  }

  addPlayer(player) {
    let isLeader = false;
    if (this.playerNames.length === 0) {
      this.leader = player;
      player.isGameLeader = true;
      isLeader = true;
      player.handleStartGame();
    }
    this.players[player.socket.id] = player;
    this.playerNames.push({
      name: player.playerName,
      isLeader,
      score: player.score,
      markerPosition: undefined,
    });
    player.playerIndex = this.playerNames.length - 1;
    this.sendUpdatePlayerList();
  }
}

module.exports = {
  MapGame,
  Player,
};
