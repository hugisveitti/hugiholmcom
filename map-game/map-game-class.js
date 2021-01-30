const request = require("request");
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

const getRandomNorthAmerica = () => {
  const lng = getRandomRange(-65, -127);
  const lat = getRandomRange(48, 7);
  console.log("getting random north america", { lat, lng });
  return { lat, lng };
};

const getRandomSouthAmerica = () => {
  const lng = getRandomRange(-4, -72);
  const lat = getRandomRange(7, -50);
  console.log("getting random south america", { lat, lng });
  return { lat, lng };
};

const getRandomEurope = () => {
  const lng = getRandomRange(44, -4);
  const lat = getRandomRange(55, 36);
  console.log("getting random europe", { lat, lng });
  return { lat, lng };
};

const getRandomAsia = () => {
  const lng = getRandomRange(117, 60);
  const lat = getRandomRange(30, 0);
  console.log("getting random asia", { lat, lng });
  return { lat, lng };
};

const possiblePlacesFuncs = [
  getRandomEurope,
  getRandomAsia,
  getRandomNorthAmerica,
  getRandomSouthAmerica,
];

const getRandomLatLng = () => {
  const r = Math.random();
  let s = 1 / possiblePlacesFuncs.length;
  for (let i = 0; i < possiblePlacesFuncs.length; i++) {
    if (r < s) {
      return possiblePlacesFuncs[i]();
    } else {
      s += 1 / possiblePlacesFuncs.length;
    }
  }
};

const getSequence = (game, callBack) => {
  // const url = `https://a.mapillary.com/v3/sequences?bbox=16.430300,7.241686,16.438757,7.253186&userkeys=AGfe-07BEJX0-kxpu9J3rA&client_id=${mapillaryAPIKey}`;
  // min_longitude,min_latitude,max_longitude,max_latitu
  let { lat, lng } = getRandomLatLng();
  let perpage = "per_page=4";
  const pano = "pano=true";
  // const bbox = `bbox=${lng},${lat},${lng + 2},${lat + 2}`;
  // const url = `https://a.mapillary.com/v3/sequences?${bbox}&${pano}&min_quality_score=3&${perpage}&client_id=${mapillaryAPIKey}`;
  let radius = "radius=100000000";
  const getImageWithLatLng = (myLat, myLng, imageKnown) => {
    if (imageKnown) {
      radius = "radius=100000";
      perpage = "per_page=50";
    }
    const bbox = `closeto=${myLng},${myLat}`;
    const url = `https://a.mapillary.com/v3/images?${bbox}&${pano}&min_quality_score=3&${perpage}&${radius}&client_id=${mapillaryAPIKey}`;
    request(options(url), (err, apiRes, body) => {
      const data = JSON.parse(body);
      console.log(data["features"].length);
      if (data["features"].length < 3) {
        console.log("not enough data");
        const newCoor = getRandomLatLng();
        getImageWithLatLng(newCoor.lat, newCoor.lng, false);
      } else if (!imageKnown) {
        const coor = data["features"][0]["geometry"]["coordinates"];
        getImageWithLatLng(coor[1], coor[0], true);
      } else {
        console.log("body got");
        console.log("my lat lang", myLat, myLng);
        // socket.emit("sendSequence", data);
        game.setCurrentGameData(data);
        game.setCurrentPosition(myLat, myLng);
        callBack();
      }
    });
  };
  getImageWithLatLng(lat, lng, false);
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
  }

  handleStartGame() {
    if (this.isGameLeader) {
      this.socket.on("handleStartGame", (data) => {
        const { timePerRound, numberOfRounds } = data;
        this.game.startGame(timePerRound, numberOfRounds);
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

      // this.socket.emit("handleCorrectPosition", {
      //   distance: currentDistance,
      //    correctPosition: this.game.currentPosition,
      // });
      this.roundGuessGotten = true;
      this.lastDistance = currentDistance;
      this.score += Math.max(this.game.maxScore - currentDistance, 0);
      this.game.playerNames[this.playerIndex].score = this.score;
      this.game.addPlayerGuessed(this);
    });
  }

  watchGetNextRound() {
    this.socket.on("handleStartNextRound", (data) => {
      console.log("handle start next round");
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
    });
    this.lastDistance = -1;
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
  }

  sendRoundOverToPlayers() {
    const playerKeys = Object.keys(this.players);
    for (let i = 0; i < playerKeys.length; i++) {
      this.players[playerKeys[i]].handleRoundOver();
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
    console.log("start monitorin time");
    this.timeoutFunction = setTimeout(() => {
      console.log("round over");
      this.sendRoundOverToPlayers();
      // this.getNextRandomPosition();
    }, this.timePerRound * 1000);
  }

  gameOver() {
    this.io
      .to(this.roomName)
      .emit("handleGameOver", { players: this.playerNames });
  }

  startRound() {
    this.currentRound++;
    if (this.currentRound > this.numberOfRounds) {
      console.log("game over");
      this.gameOver();
    } else {
      this.playersGuessed = [];
      console.log("start round");
      this.io.to(this.roomName).emit("handleSendImages", {
        gameData: this.currentGameData,
        players: this.playerNames,
        timePerRound: this.timePerRound,
        currentRound: this.currentRound,
        numberOfRounds: this.numberOfRounds,
      });
      this.monitorTime();
    }
  }

  getNextRandomPosition() {
    getSequence(this, () => {
      this.startRound();
    });
  }

  sendUpdatePlayerList() {
    console.log("send updateplayer list", this.playerNames);
    this.io
      .to(this.roomName)
      .emit("updatePlayers", { players: this.playerNames });
  }

  restartPlayersScores() {
    const playerKeys = Object.keys(this.players);
    for (let i = 0; i < playerKeys.length; i++) {
      this.players[playerKeys[i]].score = 0;
    }
  }

  startGame(timePerRound, numberOfRounds) {
    this.currentRound = 0;

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
    });
    player.playerIndex = this.playerNames.length - 1;
    this.sendUpdatePlayerList();
  }
}

module.exports = {
  MapGame,
  Player,
};
