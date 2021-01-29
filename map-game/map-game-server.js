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

  const getRandomLatLng = () => {
    const lng = parseInt(Math.random() * 180 - 70);
    const lat = parseInt(Math.random() * 360 - 180);
    console.log("getting random corr", { lat, lng });
    return { lat, lng };
  };

  const getSequence = async (socket, game) => {
    // const url = `https://a.mapillary.com/v3/sequences?bbox=16.430300,7.241686,16.438757,7.253186&userkeys=AGfe-07BEJX0-kxpu9J3rA&client_id=${mapillaryAPIKey}`;
    // min_longitude,min_latitude,max_longitude,max_latitu
    let { lat, lng } = getRandomLatLng();
    console.log("lng lat", lng, lat);
    let perpage = "per_page=4";
    const pano = "pano=true";
    // const bbox = `bbox=${lng},${lat},${lng + 2},${lat + 2}`;
    // const url = `https://a.mapillary.com/v3/sequences?${bbox}&${pano}&min_quality_score=3&${perpage}&client_id=${mapillaryAPIKey}`;
    let radius = "radius=10000000000";
    const getImageWithLatLng = (myLat, myLng, imageKnown) => {
      if (imageKnown) {
        radius = "radius=1000";
        perpage = "per_page=30";
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
          socket.emit("sendSequence", data);
          game.setCurrentPosition(myLat, myLng);
        }
      });
    };
    getImageWithLatLng(lat, lng, false);
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

  io.on("connection", (socket) => {
    console.log("connection made");
    socket.emit("connectedToRoomCallBack", { message: "Hello from socket" });
    clients[socket.id] = socket;
    const game = new MapGame(io);
    getSequence(socket, game);

    handleGuess(socket, game);

    socket.on("disconnect", (data) => {
      delete clients[socket.id];
      console.log("connected clients", Object.keys(clients));
    });
  });
};
