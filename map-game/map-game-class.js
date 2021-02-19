const { getImagesFromMapillary, getDistance } = require("./positionUtility");
const { Player } = require("./map-player-class");
const {
  addGameCreateToDatabase,
  addToAllGamesStarted,
} = require("./databasefunctions");

class MapGame {
  constructor(io, roomName) {
    this.players = {};
    this.numberOfRounds = 5;
    this.currentRound = 0;
    this.currentPosition = { lat: 0, lng: 0 };
    this.io = io;
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
    addGameCreateToDatabase();
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
    return getDistance(
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
      this.gameOver();
    } else {
      getImagesFromMapillary(this, () => {
        this.startRound();
      });
    }
  }

  sendUpdatePlayerList() {
    this.io
      .to(this.roomName)
      .emit("updatePlayers", { players: this.playerNames });
  }

  startGame(timePerRound, numberOfRounds, onlyPano, onlyEuropeUsa) {
    const myPlayerNames = this.playerNames.map((player) => player.name);
    console.log("## GAME STARTED with players:", myPlayerNames);
    addToAllGamesStarted({
      roomName: this.roomName,
      timePerRound,
      numberOfRounds,
      onlyPano,
      players: myPlayerNames,
    });
    this.currentRound = 0;
    if (onlyPano !== undefined) {
      this.onlyPano = onlyPano;
    }
    if (onlyEuropeUsa !== undefined) {
      this.onlyEuropeUsa = onlyEuropeUsa;
    }
    this.resetPlayersScore();
    // Tell user about max?
    const myTimePerRound = Math.min(+timePerRound, 2147483647);

    this.timePerRound = myTimePerRound;
    this.numberOfRounds = +numberOfRounds;
    this.gameStarted = true;
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
