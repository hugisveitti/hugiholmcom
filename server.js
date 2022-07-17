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



const port = process.env.PORT || 80;
const server = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

app.get("/takk", (req, res) => {
  res.send("Thank you for the donation!")
})

app.get("/privacy-vedur", (req, res) => {
  res.send("We don't collect any data in Betra Veður app.");
})

require("./flag-game/flag-game-server")(app);
require("./map-game/map-game-server.js")(app, server);
//require("./box-fly/box-fly-server.js")(app, server);
require("./football-money/index.js")(app);
require("./letingi/app.js")(app);
require("./bird-game/app.js")(app);
require("./quote-fill/app.js")(app);
require("./colors/colors-server.js")(app);
