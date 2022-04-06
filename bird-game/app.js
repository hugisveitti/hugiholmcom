var express = require("express");
var path = require("path");

module.exports = (app) => {
    const urlPrefix = "/fuglar/";
    app.get(urlPrefix, (req, res) => {
        res.sendFile(path.join(__dirname + "/bird-game-client/build/index.html"));
    });

    app.use(express.static(__dirname + "/bird-game-client/build"));
};
