// Import the functions you need from the SDKs you need
import { addDoc, collection, getDocs, getFirestore, limit, orderBy, query, Timestamp } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIbm5_tSRHMNsFOaatGvT-MjzFVGSOooc",
  authDomain: "fuglar-2fee1.firebaseapp.com",
  databaseURL: "https://fuglar-2fee1.firebaseio.com",
  projectId: "fuglar-2fee1",
  storageBucket: "fuglar-2fee1.appspot.com",
  messagingSenderId: "978314575412",
  appId: "1:978314575412:web:98f2f565ab80eb85e85461"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

const birdPath = "bird-highscore"
const plantPath = "plant-highscore"
const geoPath = "geo-highscore"

const getPathFromGameType = (gameType) => {
  switch (gameType) {
    case "plant":
      return plantPath
    case "bird":
      return birdPath
    case "geo":
      return geoPath
    default:
      return "no-path"
  }
}

export const getHighscores = async (gameType) => {
  return new Promise(async (resolve, reject) => {

    const path = getPathFromGameType(gameType)

    const ref = collection(db, path)
    const q = query(ref, orderBy("score", "desc"), limit(25))
    const docs = await getDocs(q)
    let arr = []
    docs.forEach(element => {
      arr.push(element.data())
      if (element.data().score === 99) {
        console.log(element.id)
      }

    });
    console.log("got highscore", gameType)
    resolve(arr)
  })
}



export const saveHighscore = (gameType, score, total, name) => {
  return new Promise((resolve, reject) => {

    const path = getPathFromGameType(gameType)

    addDoc(collection(db, path), {
      name, score, date: Timestamp.now(), total
    }).then(() => {
      resolve()
    })

  })
}

