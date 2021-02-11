const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const players = require("./eng_ger_players.json");
const APITOKEN_FOOTBALLDATA = "fa79ab71a8b247bb8f3887ed36e4e4df";

module.exports = (app) => {
  const urlPrefix = "/footballmoney/";
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  const trimTeamName = (teamName) => {
    if (teamName.substring(teamName.length - 3) === " FC") {
      teamName = teamName.slice(0, teamName.length - 3);
    }
    return teamName;
  };

  const normalizeString = (str) =>
    str
      .toLowerCase()
      .replace(/\u00fc/g, "u")
      .replace(/\u00f6/g, "o")
      .replace(/\u00e4/g, "a")
      .replace(/\u00df/g, "ss");

  const getTeamPlayers = (teamName) => {
    teamName = trimTeamName(teamName);
    teamName = normalizeString(teamName);
    const team = [];
    for (let i = 0; i < players.length; i++) {
      const playerTeam = players[i].teams;
      normalizeString(teamName);
      for (let j = 0; j < playerTeam.length; j++) {
        if (teamName === normalizeString(playerTeam[j])) {
          team.push(players[i]);
        }
      }
    }
    return team;
  };

  require("./sportdata")(app, getTeamPlayers, urlPrefix);

  app.use(express.static(path.join(__dirname, "client")));

  app.get(urlPrefix, (req, res) => {
    res.sendFile(path.join(__dirname, "client/index.html"));
  });

  const footballOptions = (url) => ({
    headers: { "X-Auth-Token": APITOKEN_FOOTBALLDATA },
    dataType: "json",
    type: "Get",
    url,
  });
};
