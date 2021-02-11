const getAllMatches = async () => {
  let matches;
  await fetch(urlPrefix + "/getallatches/" + seasonId)
    .then((res) => res.json())
    .then((data) => {
      matches = data;
    });

  return matches;
};

let playerVizLoaded = false;
const playersContainer = document.getElementById("players-container");

const xAxisSelect = document.getElementById("x-axis-select");
const yAxisSelect = document.getElementById("y-axis-select");

const options = [];

let xAxisDefaultOption = "Weekly Salary";
let yAxisDefaultOption = "Market Value";

let xAxisOption = xAxisDefaultOption;
let yAxisOption = yAxisDefaultOption;
xAxisSelect.addEventListener("change", (e) => {
  xAxisOption = e.target.value;
  updatePlayerPlots();
});
yAxisSelect.addEventListener("change", (e) => {
  yAxisOption = e.target.value;
  updatePlayerPlots();
});

const createAxisOptionSelect = () => {
  // create <select>
  for (let i = 0; i < axisOptions.length; i++) {
    const newAxisOptionY = document.createElement("option");
    newAxisOptionY.text = axisOptions[i];
    newAxisOptionY.value = axisOptions[i];
    const newAxisOptionX = document.createElement("option");
    newAxisOptionX.text = axisOptions[i];
    newAxisOptionX.value = axisOptions[i];
    xAxisSelect.appendChild(newAxisOptionX);
    yAxisSelect.appendChild(newAxisOptionY);
    if (axisOptions[i] === xAxisDefaultOption) {
      newAxisOptionX.selected = true;
    } else if (axisOptions[i] === yAxisDefaultOption) {
      newAxisOptionY.selected = true;
    }
  }
};

const calcAvgLeagueValueByType = (standings, type) => {
  let total = 0;
  for (let i = 0; i < standings.length; i++) {
    for (let j = 0; j < standings[i].playersInfo.length; j++) {
      total += getValueByType(standings[i].playersInfo[j], type);
    }
  }
  return total;
};

const countNumberOfPlayers = (standings) => {
  let total = 0;
  for (let i = 0; i < standings.length; i++) {
    total += standings[i].playersInfo.length;
  }
  return total;
};

const leagueNameSpan = document.getElementById("league-name");
const leaguePlayerCountSpan = document.getElementById("league-player-count");
const leagueAvgMarketValueSpan = document.getElementById("avg-market-value");
const leagueAvgWeeklySalarySpan = document.getElementById("avg-weekly-salary");
const loadPlayerLeagueInfo = (standings) => {
  leagueNameSpan.innerHTML = leagueName;
  const numberOfPlayers = countNumberOfPlayers(standings);
  leaguePlayerCountSpan.innerHTML = numberOfPlayers.toLocaleString();
  leagueAvgMarketValueSpan.innerHTML = (
    calcAvgLeagueValueByType(standings, "Market Value") / numberOfPlayers
  ).toLocaleString();
  leagueAvgWeeklySalarySpan.innerHTML = (
    calcAvgLeagueValueByType(standings, "Weekly Salary") / numberOfPlayers
  ).toLocaleString();
};

const loadPlayersPlots = () => {
  if (playerVizLoaded) return;
  playerVizLoaded = true;
  if (globalStandings) {
    showPlayersPlots(globalStandings);
    loadPlayerLeagueInfo(globalStandings);
    loadSunburstDiagram(globalStandings);
  } else {
    getStandings().then((standings) => {
      showPlayersPlots(standings);
      loadPlayerLeagueInfo(standings);
      loadSunburstDiagram(standings);
    });
  }
};
