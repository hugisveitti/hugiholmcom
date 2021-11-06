const request = require("request");
const uuid = require("uuid").v4;
const {
  addBadGuessLocation,
  addGoodGuessLocation,
} = require("./databasefunctions");
const { worldMapSplits } = require("./map-game-worldsplits");

const mapillaryToken = "MLY|4367117063399154|25516b1e9532102c9d0fbd3d5471bcfa"

const options = (url) => ({
  dataType: "json",
  type: "Get",
  url,
});

function getDistance(lat1, lon1, lat2, lon2, unit) {
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

const getRandomLatLng = (game) => {
  // europe
  let indexSearchLength = worldMapSplits.length;
  /**
 if (game.onlyEuropeUsa) {
   indexSearchLength = 3;
  }
  *  */
  let latIndex = Math.floor(Math.random() * indexSearchLength);
  let latRange = worldMapSplits[latIndex];
  while (latRange.latInterVal) {
    latIndex = Math.floor(Math.random() * latRange.latInterVal.length);
    latRange = latRange.latInterVal[latIndex];
  }

  const lngIndex = Math.floor(Math.random() * latRange.lngIntervals.length);

  const lngRange = latRange.lngIntervals[lngIndex];
  const lng = getRandomRange(lngRange.max, lngRange.min);
  const lat = getRandomRange(latRange.max, latRange.min);
  return { lat, lng };
};

const getImagesFromMapillary = (game, callBack) => {
  // min_longitude,min_latitude,max_longitude,max_latitu
  let { lat, lng } = getRandomLatLng(game);
  let perpage = "per_page=4";
  // not only use panos
  const pano = `pano=${game.onlyPano}`;
  // const bbox = `bbox=${lng},${lat},${lng + 2},${lat + 2}`;
  // 100 km
  let radius = "radius=1000000";
  const getImageWithLatLng = (myLat, myLng, imageKnown, radius_meters) => {
    radius = `radius=${radius_meters}`;
    if (imageKnown) {
      // 10 km
      radius = "radius=10000";
      perpage = "per_page=50";
    }

    const bbox = `${myLng},${myLat},${myLng + 1},${myLat + 1}`;
    const url = `https://graph.mapillary.com/images?access_token=${mapillaryToken}&limit=50&bbox=${bbox}&fields=id,thumb_2048_url,geometry`
    // const url = `https://a.mapillary.com/v3/images?${bbox}&${pano}&min_quality_score=3&${perpage}&${radius}&client_id=${mapillaryAPIKey}`;
    request(options(url), (err, apiRes, body) => {
      if (body === undefined) {
        getImagesFromMapillary(game, callBack)
        return
      }
      const data = JSON.parse(body)["data"];
      if (data.length < 3) {
        addBadGuessLocation({
          lat: myLat,
          lng: myLng,
          nrImages: data.length,
          radius,
          perpage,
        });
        const newCoor = getRandomLatLng(game);
        // increase search space, so loading isnt long
        getImageWithLatLng(newCoor.lat, newCoor.lng, false, radius_meters * 10);
      } else {
        // socket.emit("sendSequence", data);
        addGoodGuessLocation({
          lat: myLat,
          lng: myLng,
          nrImages: data.length,
          radius,
          perpage,
        });
        game.setCurrentGameData(data);
        const [lng, lat] = data[0].geometry.coordinates
        game.setCurrentPosition(lat, lng);
        callBack();
      }
    });
  };
  getImageWithLatLng(lat, lng, false, 1000000);
};

module.exports = {
  getImagesFromMapillary,
  getDistance,
};
