const request = require("request");
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

const mapillaryAPIKey = "QXhncjROZWhWZWRIYW8wMnZFYjNEWTo1ZGQwZDRkYzQwMzAyNDZj";

const getRandomRange = (max, min) => {
  return Math.random() * (max - min) + min;
};

const getRandomNorthAmerica = () => {
  const lng = getRandomRange(-65, -127);
  const lat = getRandomRange(48, 7);
  console.log("getting random north america", { lat, lng });
  return { lat, lng };
};

const getRandomSouthAmerica = () => {
  const lng = getRandomRange(-4, -72);
  const lat = getRandomRange(7, -50);
  console.log("getting random south america", { lat, lng });
  return { lat, lng };
};

const getRandomEurope = () => {
  const lng = getRandomRange(44, -4);
  const lat = getRandomRange(55, 36);
  console.log("getting random europe", { lat, lng });
  return { lat, lng };
};

const getRandomAsia = () => {
  const lng = getRandomRange(117, 60);
  const lat = getRandomRange(30, 0);
  console.log("getting random asia", { lat, lng });
  return { lat, lng };
};

const possiblePlacesFuncs = [
  getRandomEurope,
  getRandomAsia,
  getRandomNorthAmerica,
  getRandomSouthAmerica,
];

const getRandomLatLng = () => {
  const r = Math.random();
  let s = 1 / possiblePlacesFuncs.length;
  for (let i = 0; i < possiblePlacesFuncs.length; i++) {
    if (r < s) {
      return possiblePlacesFuncs[i]();
    } else {
      s += 1 / possiblePlacesFuncs.length;
    }
  }
};

const getSequence = async (socket, game) => {
  // const url = `https://a.mapillary.com/v3/sequences?bbox=16.430300,7.241686,16.438757,7.253186&userkeys=AGfe-07BEJX0-kxpu9J3rA&client_id=${mapillaryAPIKey}`;
  // min_longitude,min_latitude,max_longitude,max_latitu
  let { lat, lng } = getRandomLatLng();
  let perpage = "per_page=4";
  const pano = "pano=true";
  // const bbox = `bbox=${lng},${lat},${lng + 2},${lat + 2}`;
  // const url = `https://a.mapillary.com/v3/sequences?${bbox}&${pano}&min_quality_score=3&${perpage}&client_id=${mapillaryAPIKey}`;
  let radius = "radius=100000000";
  const getImageWithLatLng = (myLat, myLng, imageKnown) => {
    if (imageKnown) {
      radius = "radius=100000";
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

class Player {
  constructor(socket) {
    this.score = 0;
    this.currentGuess = { lat: 0, lng: 0 };
    this.socket = socket;
  }
}

class MapGame {
  constructor(io, socket) {
    this.players = {};
    this.numberOfRounds = 5;
    this.currentRound = 0;
    this.currentPosition = { lat: 0, lng: 0 };
    this.io = io;
    this.socket = socket;
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

  getNextRandomPosition() {
    getSequence(this.socket, this);
  }
}

module.exports = {
  MapGame,
  Player,
};
