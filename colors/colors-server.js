const path = require("path");
const express = require("express");

module.exports = (app) => {
  const urlPrefix = "/colors/";
  app.get(urlPrefix, (req, res) => {
    res.sendFile(path.join(__dirname + "/colors-client/index.html"));
  });
  app.use(express.static(__dirname + "/colors-client"));
};
