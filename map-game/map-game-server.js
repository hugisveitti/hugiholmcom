const express = require("express");
const path = require("path");
const { disconnect } = require("process");
const request = require("request");

const { MapGame, Player } = require("./map-game-class");

const mapillaryAPIKey = "QXhncjROZWhWZWRIYW8wMnZFYjNEWTo1ZGQwZDRkYzQwMzAyNDZj";

const options = (url) => ({
  dataType: "json",
  type: "Get",
  url,
});

module.exports = (app, server) => {
  const clients = {};
  const games = {};
  var io = require("socket.io")(server, { cors: { origin: "*" } });
  const urlPrefix = "/jeojuessr/";

  app.use(express.static(path.join(__dirname, "./map-game-client/build")));

  app.get(urlPrefix, (req, res) => {
    res.sendFile(path.join(__dirname, "./map-game-client/build/index.html"));
  });

  app.get(urlPrefix + "/*", (req, res) => {
    res.sendFile(path.join(__dirname, "./map-game-client/build/index.html"));
  });

  const disconnectPlayer = (socket) => {
    // delete game if no one is using
    const gameRooms = Object.keys(games);
    for (let i = 0; i < gameRooms.length; i++) {
      const playerIds = Object.keys(games[gameRooms[i]].players);
      let playersDisconnected = 0;
      for (let j = 0; j < playerIds.length; j++) {
        if (playerIds[j] === socket.id) {
          games[gameRooms[i]].players[playerIds[j]].disconnected = true;
        }

        if (games[gameRooms[i]].players[playerIds[j]].disconnected) {
          playersDisconnected += 1;
        }
      }

      if (playersDisconnected === playerIds.length) {
        console.log("all players disconnected, deleting game", gameRooms[i]);
        delete games[gameRooms[i]];
      }
    }
  };

  io.on("connection", (socket) => {
    console.log("connection made");
    socket.emit("connectedToRoomCallBack", { message: "Hello from socket" });

    socket.on("roomConnection", (data) => {
      console.log(data);
      const { roomName, playerName } = data;
      console.log("### PLAYER ", playerName, "CONNECTED");
      socket.join(roomName);
      if (roomName in games) {
        const game = games[roomName];
        const player = game.createPlayer(playerName, socket);
        if (player) {
          // player created
        } else {
          console.log("name in use", playerName);
        }
      } else {
        const player = new Player(socket, playerName);
        const game = new MapGame(io, socket, roomName);
        game.addPlayer(player);
        player.setGame(game);
        player.setIsGameLeader();
        games[roomName] = game;
      }
    });

    clients[socket.id] = socket;

    socket.on("disconnect", (data) => {
      console.log("client disconnected");
      delete clients[socket.id];
      console.log("connected clients", Object.keys(clients));

      disconnectPlayer(socket);
    });
  });
};
