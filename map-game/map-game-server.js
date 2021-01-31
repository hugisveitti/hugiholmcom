const express = require("express");
const path = require("path");
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
  const urlPrefix = "/map-game/";

  app.use(express.static(path.join(__dirname, "./map-game-client/build")));

  app.get(urlPrefix, (req, res) => {
    res.sendFile(path.join(__dirname, "./map-game-client/build/index.html"));
  });

  app.get(urlPrefix + "random", (req, res) => {
    res.send("hello map game");
  });

  io.on("connection", (socket) => {
    console.log("connection made");
    socket.emit("connectedToRoomCallBack", { message: "Hello from socket" });

    socket.on("roomConnection", (data) => {
      console.log(data);
      const { roomName, playerName } = data;
      socket.join(roomName);
      const player = new Player(socket, playerName);
      if (roomName in games) {
        const game = games[roomName];
        game.addPlayer(player);
        player.setGame(game);
      } else {
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

      // delete game if no one is using
    });
  });
};
