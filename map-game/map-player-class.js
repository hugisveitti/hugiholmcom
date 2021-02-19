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
        let { timePerRound, numberOfRounds, onlyPano, onlyEuropeUsa } = data;
        if (!onlyPano) {
          onlyPano = this.game.onlyPano;
          if (!onlyPano) {
            onlyPano = false;
          }
        }
        if (!onlyEuropeUsa) {
          onlyEuropeUsa = this.game.onlyEuropeUsa;
          if (!onlyEuropeUsa) {
            onlyEuropeUsa = false;
          }
        }
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

module.exports = {
  Player,
};
