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

class Player {
  constructor(socket) {
    this.score = 0;
    this.currentGuess = { lat: 0, lng: 0 };
    this.socket = socket;
  }
}

class MapGame {
  constructor(io) {
    this.players = {};
    this.numberOfRounds = 5;
    this.currentRound = 0;
    this.currentPosition = { lat: 0, lng: 0 };
    this.io = io;
  }

  calculateDistance(lat, lng) {
    return distance(
      lat,
      lng,
      this.currentPosition.lat,
      this.currentPosition.lng,
      "K"
    );
  }

  setCurrentPosition(lat, lng) {
    this.currentPosition.lat = lat;
    this.currentPosition.lng = lng;
  }
}

module.exports = {
  MapGame,
  Player,
};
