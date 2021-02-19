const firebase = require("firebase/app");
require("firebase/database");

var firebaseConfig = {
  apiKey: "AIzaSyCdg0DSLz5G8zEooIEuTZ4EK_eDhRFi8q0",
  authDomain: "jeojuessr.firebaseapp.com",
  databaseURL: "https://jeojuessr-default-rtdb.firebaseio.com",
  projectId: "jeojuessr",
  storageBucket: "jeojuessr.appspot.com",
  messagingSenderId: "142124503209",
  appId: "1:142124503209:web:cf9a9120c7e9201e1099b8",
  measurementId: "G-9H8G44VF1B",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
var database = firebaseApp.database();

module.exports = { database };
