var express = require("express");
var path = require("path");

module.exports = (app) => {
  const urlPrefix = "/flaggame/";
  app.get(urlPrefix, (req, res) => {
    res.sendFile(path.join(__dirname + "/client/index.html"));
  });

  app.use(express.static(__dirname + "/client"));
};
