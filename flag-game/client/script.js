var countries;
var allCountries = [];
//arrays with every country in each continent
var africa = [],
  americas = [],
  europe = [],
  asia = [],
  oceania = [];
var html = [];
var rnd = 0;
var score = 0;
var boolCap = false;
var boolCount = false;
//settings is either countryNameFour, nameCapital, capitalFour or capital
//countryNameFour is you guess the country's name from the flag with four options
//nameCapital is you write the country's name and capital from the flag
//capitalFour is you guess the country's capital from the flag with four options
//capital is you write the capital
var settings = "countryNameFour";
//gameSettings is either all or random
var gameSettings = "all";
var wrongCount = 0;
//bonus increases to 2 if you get 5 right and 4 if 5 more
var bonus = 1;
var ansRow = 0;
var gameOver = false;

var database;

var region;

//which region is being played
var regionPlaying = "allcountires";

//scoreUrl so we know what game is being played and get highscores
var scoreUrl;

function shuffleArray(array) {
  for (var i = 0; i < array.length * 100; i++) {
    var num1 = Math.floor(Math.random() * array.length);
    var num2 = Math.floor(Math.random() * array.length);
    var temp = array[num1];
    array[num1] = array[num2];
    array[num2] = temp;
  }
}

function loadCountries() {
  $.ajax({
    url: "https://restcountries.eu/rest/v2/all",
    dataType: "json",
    type: "GET",
  }).done(function (response) {
    allCountries = response;
    countries = allCountries;
    shuffleArray(countries);
    for (var i = 0; i < allCountries.length; i++) {
      var country = allCountries[i];

      switch (country.region) {
        case "Europe":
          europe.push(country);
          break;
        case "Africa":
          africa.push(country);
          break;
        case "Oceania":
          oceania.push(country);
          break;
        case "Asia":
          asia.push(country);
          break;
        case "Americas":
          americas.push(country);
          break;
        default:
          console.log(country.name + " has no region");
      }
    }
    if (gameSettings === "all") {
      $("#randButt").text(rnd + "/" + countries.length);
    }
    randomCountry();
  });
}

loadCountries();

function randomCountry() {
  score = 0;
  bonus = 1;
  ansRow = 0;
  gameOver = false;
  if (settings === "nameCapital") {
    nameCapital();
  } else if (settings === "countryNameFour") {
    countryNameFour();
  } else if (settings === "capital") {
    guessCapital("input");
  } else if (settings === "capitalFour") {
    guessCapital("four");
  }
}

//func to add a card in the html with the country at num
function addHtmlFlagCard(num) {
  html.push(
    `
    <div class="center-align">
        <div class="col s12 m6">
          <div class="card-iamge">
            <div class="card-content white-text">
              <img class="z-depth-3" width="200" src="` +
      countries[num].flag +
      `">
            </div>
          </div>
        </div>
      </div>
    `
  );
}

//function that creates options from an array of and either name or capital of country
function cardOptions(array, nameOrCapital) {
  //create four values to go on the cards, set the to capitals or names
  var one, two, three, four;
  if (nameOrCapital === "name") {
    one = countries[array[0]].name;
    two = countries[array[1]].name;
    three = countries[array[2]].name;
    four = countries[array[3]].name;
  } else {
    console.log("capital opiton");
    one = countries[array[0]].capital;
    two = countries[array[1]].capital;
    three = countries[array[2]].capital;
    four = countries[array[3]].capital;
  }

  //to make the button change color when right or wrong
  var oneCard = 1;
  var twoCard = 2;
  var threeCard = 3;
  var fourCard = 4;

  html.push(
    `
    <div class="row">
    <div class="col s6">
      <div id="1" onclick="fourFlags(` +
      array[0] +
      `,` +
      oneCard +
      `)" class="center-align card-panel blue hoverable">
        <span class="white-text flow-text truncate">` +
      one +
      `
        </span>
      </div>
    </div>
  <div class="col s6">
    <div id="2" onclick="fourFlags(` +
      array[1] +
      `,` +
      twoCard +
      `)" class="center-align card-panel blue hoverable">
      <span  class="white-text flow-text truncate">` +
      two +
      `
      </span>
    </div>
  </div>

  <div class="col s6">
    <div id="3" onclick="fourFlags(` +
      array[2] +
      `,` +
      threeCard +
      `)" class="center-align card-panel blue hoverable">
      <span  class="white-text flow-text truncate">` +
      three +
      `
      </span>
    </div>
  </div>

  <div class="col s6">
    <div id="4" onclick="fourFlags(` +
      array[3] +
      `,` +
      fourCard +
      `)" class="center-align card-panel blue hoverable">
      <span class="white-text flow-text truncate">` +
      four +
      `
      </span>
    </div>
  </div>
</div>
    `
  );
}

//play four options, display a flag and four country names
function countryNameFour() {
  //clear html
  html = [];

  //if gameSettings if set to random then we will get a random numbers
  //if not then we will get the next number,
  //this is possible because we shuffle the array in the beginning
  if (gameSettings === "random") {
    rnd = Math.floor(Math.random() * countries.length);
  }

  //get 3 random numbers for options
  var rand1 = Math.floor(Math.random() * countries.length);
  var rand2 = Math.floor(Math.random() * countries.length);
  var rand3 = Math.floor(Math.random() * countries.length);

  //so that no number is the same
  while (rand1 === rnd) {
    rand1 = Math.floor(Math.random() * countries.length);
  }
  while (rand2 === rnd || rand2 === rand1) {
    rand2 = Math.floor(Math.random() * countries.length);
  }
  while (rand3 === rnd || rand3 === rand1 || rand3 === rand2) {
    rand3 = Math.floor(Math.random() * countries.length);
  }

  //if wrong answer then display how many wrong

  if (gameSettings === "all") {
    html.push(
      `
          <div class="center-align">
            <a id="wrongButton" class="button btn">Score ` +
        score +
        `</a>
            <a id="bonusButton" class="button btn">` +
        bonus +
        `x</a>
          </div>
          <br>
          `
    );
  }
  //else {
  html.push(
    `
          <div class="center-align">
              <a id="rowButton" class="button btn">Right in a Row ` +
      ansRow +
      `</a>
          </div>
          <br>
          `
  );
  //}

  //add a card with a flag
  addHtmlFlagCard(rnd);

  var allRand = [rnd, rand1, rand2, rand3];

  //shuffle the random numbers
  for (var i = 0; i < 1000; i++) {
    var num = Math.floor(Math.random() * 4);
    var num2 = Math.floor(Math.random() * 4);
    let temp = allRand[num];
    allRand[num] = allRand[num2];
    allRand[num2] = temp;
  }

  //add the cards of options
  cardOptions(allRand, "name");

  $("#country").html(html.join(""));
}

//add has answered boolean so you cant press another button while the right button get's green
var hasAnswered = false;

function fourFlags(num, numCard) {
  var idCard = "#" + numCard;
  //$("#oneCard").removeClass("center-align card-panel blue hoverable").addClass("center-align card-panel green hoverable");
  if (num === rnd) {
    //make button green if correct
    $(idCard)
      .removeClass("center-align card-panel blue hoverable")
      .addClass("center-align card-panel green hoverable");
    //Materialize.toast("Correct", 2000);
    score = score + bonus;
    ansRow++;
    html = [];
    if (gameSettings != "random") {
      if (ansRow % 5 == 0) {
        bonus = bonus * 2;
        Materialize.toast(
          ansRow + " Right Answers in a Row",
          1500,
          "",
          function () {
            Materialize.toast(
              "Right Answer Now Gives " + bonus + " points",
              1500
            );
          }
        );
      }
      rnd++;
      $("#randButt").text(rnd + "/" + countries.length);
      //Player has finished the game
      ///////////////////////////////////////////
      //////////////////////////////////////////
      //////////////////////////////////////////
      if (rnd === countries.length) {
        console.log("finsied");
        gameOver = true;
        finishedGame();
      }
    }
    if (settings === "countryNameFour" && !gameOver) {
      setTimeout(function () {
        countryNameFour();
      }, 300);
    } else if (!gameOver) {
      setTimeout(function () {
        guessCapital("four");
      }, 300);
    }
  } else {
    $(idCard)
      .removeClass("center-align card-panel blue hoverable")
      .addClass("center-align card-panel red hoverable");
    if (bonus != 1) {
      Materialize.toast("In a Row Bonus Lost", 1000);
    }
    ansRow = 0;
    bonus = 1;
    score--;
    $("#wrongButton").text("Score " + score);
    $("#bonusButton").text(bonus + "x");
  }
  $("#rowButton").text("Right in a Row " + ansRow);
}

//display a flag and user types in name and capital
function nameCapital() {
  boolCap = false;
  boolCount = false;
  html = [];
  if (gameSettings === "random") {
    rnd = Math.floor(Math.random() * countries.length);
  }

  html.push(
    `
    <div class="center-align">
        <div class="col s12 m6">
          <div class="card-image">
            <div class="card-content white-text">
              <img class="z-depth-3" width="200" src="` +
      countries[rnd].flag +
      `">
            </div>
            <div class="card-action">
            <div>
                 <label for="country_name">Country Name</label>
                 <input id="country_name" type="text" class="validate">
            </div>
            <div>
                 <label for="country_capital">Country Capital</label>
                 <input id="country_capital" type="text" class="validate" >
            </div>
            </div>
            <div class="center-align">
            <a id="giveUp" class="button btn" href="#" onclick="giveUp()">Give Up</a>
            </div>
            </div>
          </div>
        </div>
      </div>
    `
  );

  $("#country").html(html.join(""));

  $("#country_name")
    .keyup(function () {
      var name = $(this).val();
      console.log(name);
      console.log(countries[rnd].name);
      console.log("rnd is " + rnd);
      //if name is correct
      if (name.toUpperCase() === countries[rnd].name.toUpperCase()) {
        boolCount = true;
        //check if both capital and Country are correct
        checkCorrect();
      }

      //also allowd if altSpellings is same
      for (var j = 0; j < countries[rnd].altSpellings.length; j++) {
        console.log(countries[rnd].altSpellings[j]);
        if (
          name.toUpperCase() === countries[rnd].altSpellings[j].toUpperCase()
        ) {
          boolCount = true;
          //check if both capital and country are correct
          checkCorrect();
        }
      }
    })
    .keyup();

  //check if capital is correct
  $("#country_capital")
    .keyup(function () {
      var capital = $(this).val();
      console.log(capital);
      console.log(countries[rnd].capital);
      if (capital.toUpperCase() === countries[rnd].capital.toUpperCase()) {
        boolCap = true;

        //check if capital and country are correct
        checkCorrect();
      }
    })
    .keyup();
}

//fucntion to check if  both capital and name are correct
function checkCorrect() {
  if (boolCount === true) {
    //disable the inputs if they are correct
    $("#country_name").val(countries[rnd].name);
    document.getElementById("country_name").disabled = true;
  } else if (boolCap === true) {
    if (settings === "nameCapital") {
      document.getElementById("country_capital").disabled = true;
    }
    //if only guessing the capital
    else {
      Materialize.toast("Correct", 2000);
      //make giveup button greeer and display Correct
      $("#giveUp").text("CORRECT");
      $("#giveUp").removeClass("button btn").addClass("button btn green");

      setTimeout(function () {
        guessCapital("input");
      }, 200);
      if (gameSettings != "random") {
        rnd++;
        score++;
        $("#randButt").text(score + "/" + countries.length);
      }
    }
  }
  //if both correct update score and go to next one
  if (boolCap === true && boolCount === true) {
    Materialize.toast("Correct", 2000);
    if (gameSettings != "random") {
      rnd++;
      score++;
      $("#randButt").text(score + "/" + countries.length);
    }
    randomCountry();
  }
}

var givenUp = true;
//if you press giveUp then you see the anwsers
function giveUp() {
  if (givenUp) {
    $("#country_name").val(countries[rnd].name);
    $("#country_capital").val(countries[rnd].capital);
    $("#giveUp").text("Next");
    givenUp = false;
  } else {
    $("#giveUp").text("Give Up");
    givenUp = true;
    next();
  }
}

function next() {
  rnd++;
  if (settings === "nameCapital") {
    nameCapital();
  } else {
    guessCapital("input");
  }
}

function newGame() {
  rnd = 0;
  score = 0;
  ansRow = 0;
  bonus = 1;
  $("#randButt").text(rnd + "/" + countries.length);
  if (settings === "countryNameFour") {
    countryNameFour();
  } else if (settings === "nameCapital") {
    nameCapital();
  } else if (settings === "capital") {
    guessCapital();
  }
}

//the game gusee capital, you see a flag and the country name and you guess the capital
//the possibility of have in four options and input option?
function guessCapital(stilling) {
  //clear the html
  html = [];
  if (gameSettings === "random") {
    rnd = Math.floor(Math.random() * countries.length);
  }
  boolCap = false;

  console.log("stilling er " + stilling);
  //add a card with a flag TO THE html
  addHtmlFlagCard(rnd);
  //add the name of the country
  html.push(
    `
      <div class="center-align">
          <div class="col s12 m6">
            <span>` +
      countries[rnd].name +
      `</span>
          </div>
        </div>
      `
  );

  //if four options than create three possibilities
  if (stilling === "four") {
    //get 3 random numbers for options
    var rand1 = Math.floor(Math.random() * countries.length);
    var rand2 = Math.floor(Math.random() * countries.length);
    var rand3 = Math.floor(Math.random() * countries.length);

    //so that no number is the same
    while (rand1 === rnd) {
      rand1 = Math.floor(Math.random() * countries.length);
    }
    while (rand2 === rnd && rand2 === rand1) {
      rand2 = Math.floor(Math.random() * countries.length);
    }
    while (rand3 === rnd && rand3 === rand1 && rand3 === rand2) {
      rand3 = Math.floor(Math.random() * countries.length);
    }

    var allRand = [rnd, rand1, rand2, rand3];
    shuffleArray(allRand);

    cardOptions(allRand, "capital");

    if (gameSettings === "all") {
      html.push(
        `
          <div class="center-align">
            <a id="wrongButton" class="button btn">Wrong Answers ` +
          wrongCount +
          `</a>
          </div>
          `
      );
    }
  }
  //if input game
  else {
    html.push(`
        <div class="center-align">
            <div class="col s12 m6">
                <div class="card-action">
                <div>
                     <label for="country_capital">Country Capital</label>
                     <input id="country_capital" type="text" class="validate" >
                </div>
                </div>
                <div class="center-align">
                <a id="giveUp" class="button btn" href="#" onclick="giveUp()">Give Up</a>
                </div>
              </div>
            </div>
          </div>
        `);
  }

  if (gameSettings != "random") {
    addHTMLScoreCard();
  }

  $("#country").html(html.join(""));

  $("#country_capital")
    .keyup(function () {
      var capital = $(this).val();
      console.log(capital);
      console.log(countries[rnd].capital);
      if (capital.toUpperCase() === countries[rnd].capital.toUpperCase()) {
        boolCap = true;

        //check if capital and country are correct
        checkCorrect();
      }
    })
    .keyup();
}

//held ad thessi se gagnslaus
function addHTMLScoreCard() {
  html.push(
    `
    <div class="row">
      <div class="col s2 center-align">
        <span  class="white-text flow-text truncate">` +
      score +
      `
        </span>
      </div>
    </div>
    `
  );
}

//if user finishes all countries
function finishedGame() {
  if (userNameBlank) {
    //if userName is left blank then we dont have to
  } else {
    html = [];

    html.push(
      `
    <div class="center-align">
      <div class="col s12 m6">
        <div class="card green z-depth-3">
          <div class="card-content white-text">
            <span class="card-title">Finished</span>
            <p>You finished the game with ` +
        score +
        ` points</p>
          </div>
          <div class="card-action">

               <label for="userName" class="white-text">Name</label>
               <input id="userName" type="text" class="validate center-align white-text white-underline" >
               <a href="#" onclick="submitScore()" class="white-text btn">Submit Score</a>
          </div>
        </div>
      </div>
    </div>
    <div class="center-align">
      <a href="#" class="button btn center-align" onclick="playAgainRandomCountry()">Play Again</a>
    </div>
    `
    );

    $("#country").html(html.join(""));
  }
}

var userNameBlank = false;
function submitScore() {
  var userName = $("#userName").val();
  while (userName === "") {
    userNameBlank = true;
    Materialize.toast("Please write your name", 2000);
    return finishedGame();
  }
  scoreUrl = "someerror";
  console.log("gameSettings is " + settings);
  //add to the database
  scoreUrl = settings + regionPlaying;
  console.log("ScoreUrl", scoreUrl);

  var scoreSubmit = database.ref(scoreUrl);
  var data = {
    user: userName,
    score: score,
  };

  scoreSubmit.push(data);
  Materialize.toast("Score Submitted!", 2000);
  console.log(userName + " " + score);
  gameOver = false;
  userNameBlank = false;
  setTimeout(function () {
    newGame();
  }, 500);

  //randomCountry();
}

function callback(err) {
  if (err) {
    console.log("there was an error");
  } else {
    console.log("succass");
  }
}

//if user clicks play again with username input not blank and has clicked only once
var clickedOncePlayAgain = false;
function playAgainRandomCountry() {
  var userName = $("#userName").val();
  if (userName != "" && !clickedOncePlayAgain) {
    Materialize.toaser(userName + " you haven't submitted your score", 2000);
    clickedOncePlayAgain = true;
  } else if (userName != "" && clickedOncePlayAgain) {
    randomCountry();
    clickedOncePlayAgain = false;
  } else {
    randomCountry();
    clickedOncePlayAgain = false;
  }
}

$(document).ready(function () {
  //check which region to play
  $(".Region").click(function () {
    region = $(this).attr("value");
    switch (region) {
      case "Europe":
        countries = europe;
        regionPlaying = "europe";
        break;
      case "Africa":
        countries = africa;
        regionPlaying = "africa";
        break;
      case "Oceania":
        countries = oceania;
        regionPlaying = "oceania";
        break;
      case "Asia":
        countries = asia;
        regionPlaying = "asia";
        break;
      case "Americas":
        countries = americas;
        regionPlaying = "americas";
        break;
      default:
        countries = allCountries;
        regionPlaying = "allcountries";
    }

    //shuffle the countries array!!
    shuffleArray(countries);

    //zero the counters
    score = 0;
    rnd = 0;
    bonus = 1;
    ansRow = 0;
    gameOver = false;

    if (region != "All Countries") {
      $("#country_title").text("Countries of " + region);
    } else {
      $("#country_title").text("Countries");
    }
    newGame();
    $(".button-collapse").sideNav("hide");

    if (gameSettings === "all") {
      $("#randButt").text(rnd + "/" + countries.length);
    }
  });

  //gamesettings, if clicked then start new game
  $(".settings").click(function () {
    if (settings != $(this).attr("value")) {
      settings = $(this).attr("value");
      console.log("settings is " + settings);
      if (settings === "nameCapital") {
        nameCapital();
      } else if (settings === "countryNameFour") {
        countryNameFour();
      } else if (settings === "capital") {
        guessCapital("input");
      } else if (settings === "capitalFour") {
        guessCapital("four");
      }
    }
    //if something is clicked the sidenav goes away
    $(".button-collapse").sideNav("hide");
  });

  //random or get them all
  $(".gameSettings").click(function () {
    gameSettings = $(this).attr("value");
    if (gameSettings === "random") {
      $("#randButt").text("Random Country");
    } else {
      //zero the counters
      score = 0;
      rnd = 0;
      bonus = 1;
      ansRow = 0;
      gameOver = false;

      newGame();
      $("#randButt").text(rnd + "/" + countries.length);
    }

    console.log(gameSettings);
    //if something is clicked the sidenav goes away
    $(".button-collapse").sideNav("hide");
  });

  $(".button-collapse").sideNav();
  var piss = $("#country_title").text();

  $(".collapsible").collapsible();

  $(".dropdown-button").dropdown();

  //hmm fortidar hugi var thetta snidugt???
  //firebase
  var config = {
    apiKey: "AIzaSyBKgdR5J1cXEMpF7Sc4kTNGLiuSfPJp25g",
    authDomain: "countries-5eade.firebaseapp.com",
    databaseURL: "https://countries-5eade.firebaseio.com",
    projectId: "countries-5eade",
    storageBucket: "",
    messagingSenderId: "471362001741",
  };
  firebase.initializeApp(config);
  database = firebase.database();

  $("#highscores").click(function () {
    console.log("highscores");
  });
});

//https://www.youtube.com/watch?v=NcewaPfFR6Y
function getHighscores() {
  $(".button-collapse").sideNav("hide");
  //scoreUrl = "capitalsof" + regionPlaying;
  scoreUrl = settings + regionPlaying;
  console.log(scoreUrl);
  var ref = database.ref(scoreUrl);
  console.log(ref);
  ref.on("value", scoreData, scoreErr);
}

//if the highscore is there, make a table with the highscores
function scoreData(data) {
  console.log(data.val());
  var output = data.val();
  var keys = Object.keys(output);

  var highscoreArray = [];

  //create an array with all the users and scores and sort them at the same time
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var outputUser = output[k].user;
    var outputScore = output[k].score;
    console.log(outputScore, outputUser);
    var userScore = [outputScore, outputUser];
    //highscoreArray.push(outputScore);
    highscoreArray.push(userScore);
  }
  //kannski gera eigid sort seinnna;
  console.log(highscoreArray[0][0]);
  //sort the array

  for (var i = 1; i < highscoreArray.length; i++) {
    var tmp = highscoreArray[i];
    for (var j = i - 1; j >= 0 && highscoreArray[j][0] > tmp[0]; j--) {
      highscoreArray[j + 1] = highscoreArray[j];
    }

    highscoreArray[j + 1] = tmp;
  }

  highscoreArray.reverse();

  //highscoreArray.sort();
  for (var i = 0; i < highscoreArray.length; i++) {
    console.log(highscoreArray[i]);
  }

  //create html for the highscore table
  html = [];

  //dropdown button for getting different highscores

  $("#randButt").text(regionPlaying + " highscore");
  html.push(`
    <div class="center-align">
    <a class="button btn" onclick="otherHighscores()">Other highscores</a>
    </div>
    <table class="centered striped">
      <thead>
        <tr>
          <th>User</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
    `);
  //for loop

  for (var i = 0; i < highscoreArray.length; i++) {
    html.push(
      `
    <tr>
      <td>` +
        highscoreArray[i][1] +
        `</td>
      <td>` +
        highscoreArray[i][0] +
        `</td>
    </tr>
    `
    );
  }

  html.push(`
        </tbody>
      </thead>
      `);

  $("#country").html(html.join(""));
}

function scoreErr(err) {
  console.log("error", err);
}

function otherHighscores() {
  console.log("otherHighscores");
  html = [];
  html.push(`
    <table class="bordered highlight centered">
    <tbody>
      <tr>
        <td onclick="newHighscoreList('All Countries')">All Countries</td>
        </tr>
        <tr>
        <td onclick="newHighscoreList('Africa')">Africa</td>
        </tr>
        <tr>
        <td onclick="newHighscoreList('Americas')">Americas</td>
        </tr>
        <tr>
        <td onclick="newHighscoreList('Asia')">Asia</td>
        </tr>
        <tr>
        <td onclick="newHighscoreList('Europe')">Europe</td>
        </tr>
        <tr>
        <td onclick="newHighscoreList('Oceania')">Oceania</td>
      </tr>
    </tbody>
    </table>
    `);

  $("#country").html(html.join(""));
}

function newHighscoreList(region) {
  switch (region) {
    case "Europe":
      countries = europe;
      regionPlaying = "europe";
      break;
    case "Africa":
      countries = africa;
      regionPlaying = "africa";
      break;
    case "Oceania":
      countries = oceania;
      regionPlaying = "oceania";
      break;
    case "Asia":
      countries = asia;
      regionPlaying = "asia";
      break;
    case "Americas":
      countries = americas;
      regionPlaying = "americas";
      break;
    default:
      countries = allCountries;
      regionPlaying = "allcountries";
  }
  getHighscores();
}
