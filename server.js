const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

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

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

require("./flag-game/flag-game-server.js")(app);
require("./map-game/map-game-server.js")(app, server);
require("./box-fly/box-fly-server.js")(app, server);
require("./football-money/index.js")(app);
require("./letingi/app.js")(app);
