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

module.exports = (app, server) => {
  // const http = require("http").Server(app);
  const clients = {};
  var io = require("socket.io")(server, { cors: { origin: "*" } });
  const urlPrefix = "/map-game/";

  app.use(express.static(path.join(__dirname, "map-game-client/build")));

  app.get(urlPrefix, (req, res) => {
    res.sendFile(path.join(__dirname, "./map-game-client/build/index.html"));
  });

  app.get(urlPrefix + "random", (req, res) => {
    res.send("hello map game");
  });

  const getImage = (socket) => {
    socket.on("getImageData", (socketData) => {
      const { imageKey } = socketData;
      const url = `https://a.mapillary.com/v3/images/${imageKey}?client_id=${mapillaryAPIKey}`;
      console.log("getting image data");
      request(options(url), (err, apiRes, body) => {
        const data = JSON.parse(body);
        socket.emit("getImage", data);
      });
    });
  };

  const handleGuess = (socket, game) => {
    socket.on("handleSendGuess", (data) => {
      console.log("guess received", data);
      const currentDistance = game.calculateDistance(
        data.position.lat,
        data.position.lng
      );
      socket.emit("handleCorrectPosition", {
        distance: currentDistance,
        correctPosition: game.currentPosition,
      });
    });
  };

  const handleGetNextPosition = (socket, game) => {
    socket.on("handleGetNextPosition", (data) => {
      game.getNextRandomPosition();
    });
  };

  io.on("connection", (socket) => {
    console.log("connection made");
    socket.emit("connectedToRoomCallBack", { message: "Hello from socket" });
    clients[socket.id] = socket;
    const game = new MapGame(io, socket);
    game.getNextRandomPosition();
    // getSequence(socket, game);

    handleGuess(socket, game);

    handleGetNextPosition(socket, game);

    socket.on("disconnect", (data) => {
      delete clients[socket.id];
      console.log("connected clients", Object.keys(clients));
    });
  });
};
