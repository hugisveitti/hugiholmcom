const express = require("express");
var bodyParser = require("body-parser");

module.exports = (app, server) => {
  const urlPrefix = "/boxfly/";
  var io = require("socket.io")(server, { cors: { origin: "*" } });

  var allConnectedRooms = [];

  app.get(urlPrefix, (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
  });

  io.emit("chat msg", { for: "everyone" });

  io.on("connection", (socket) => {
    console.log("a user connected to box-fly");

    socket.join("some room");

    socket.on("chat msg", (msg) => {
      io.to(socket.room).emit("chat msg", msg);
      console.log("msg: " + msg);
    });

    socket.on("send data", (data) => {
      // console.log("data", data)
      io.to(socket.room).emit("receive data", data);
      // io.emit("receive data", data)
    });

    socket.on("send game over", (data) => {
      console.log("send game over");
      io.to(socket.room).emit("receive game over", data);
      // io.emit("receive game over", data);
    });

    socket.on("send restart game", (data) => {
      console.log("restart game");
      io.to(socket.room).emit("receive restart game", data);
      // io.emit("receive restart game", data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      for (var i = 0; i < allConnectedRooms.length; i++) {
        if (socket.room == allConnectedRooms[i]) {
          allConnectedRooms.splice(i, 1);
        }
      }
    });

    socket.on("switchRoom", (newRoom) => {
      console.log(socket.room);
      var connectedToRoom = 1;
      for (var i = 0; i < allConnectedRooms.length; i++) {
        if (socket.room == allConnectedRooms[i]) {
          allConnectedRooms.splice(i, 1);
        }
        if (allConnectedRooms[i] == newRoom) {
          connectedToRoom += 1;
        }
      }
      console.log("connectedToRoom " + connectedToRoom);

      console.log(newRoom);
      socket.leave(socket.room);

      socket.join(newRoom);
      socket.emit("updatechat", "SERVER", "you have connected to " + newRoom);
      socket.room = newRoom;
      socket.broadcast
        .to(newRoom)
        .emit(
          "updatechat",
          "SERVER",
          socket.username + " has joined this room"
        );

      // var ready = "a";
      io.to(newRoom).emit("updatedRoom", {
        newRoom: newRoom,
        ready: connectedToRoom === 2,
      });

      allConnectedRooms.push(newRoom);
      console.log(allConnectedRooms);
    });
  });

  app.use("/client", express.static(__dirname + "/client"));

  app.use(bodyParser.urlencoded({ extended: true }));
  //app.use(app.router);

  app.post(urlPrefix + "sendID", (req, res) => {
    console.log(req.body);
    // console.log(req);
    // res.sendFile()
  });
};
