const { database } = require("./firebase-config");

const addPlayerConnectedToRoom = () => {
  const playersConnectedToRoomsRef = "metaData/playersConnectedToRooms";
  database
    .ref(playersConnectedToRoomsRef)
    .once("value")
    .then((snap) => {
      let playersCount = snap.val();
      if (!playersCount) playersCount = 0;
      playersCount += 1;
      database.ref(playersConnectedToRoomsRef).set(playersCount);
    });
};

const addGameCreateToDatabase = () => {
  const gamesCreatedRef = "metadata/games-created";
  database
    .ref(gamesCreatedRef)
    .once("value")
    .then((snap) => {
      let gamesCount = snap.val();
      if (!gamesCount) gamesCount = 0;
      gamesCount += 1;
      database.ref(gamesCreatedRef).set(gamesCount);
    });
};

const addBadGuessLocation = ({ lat, lng, nrImages, radius, perpage }) => {
  const badLocationRef = "bad-locations/";
  const newKey = database.ref().child(badLocationRef).push().key;
  const updates = {};
  updates[badLocationRef + newKey] = { lat, lng, nrImages, radius, perpage };
  database.ref().update(updates);
};

const addGoodGuessLocation = ({ lat, lng, nrImages, radius, perpage }) => {
  const goodLocationRef = "good-locations/";
  const newKey = database.ref().child(goodLocationRef).push().key;
  const updates = {};
  updates[goodLocationRef + newKey] = { lat, lng, nrImages, radius, perpage };
  database.ref().update(updates);
};

const addToAllGamesStarted = (object) => {
  const allGamesStartedRef = "all-games-started/";
  const newKey = database.ref().child(allGamesStartedRef).push().key;
  const updates = {};
  updates[allGamesStartedRef + newKey] = object;
  database.ref().update(updates);
};

module.exports = {
  addPlayerConnectedToRoom,
  addGameCreateToDatabase,
  addBadGuessLocation,
  addGoodGuessLocation,
  addToAllGamesStarted,
};
