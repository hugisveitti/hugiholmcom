let defaultStanginsOption = "Market Value";
let standingsOption = defaultStanginsOption;

const standingsSelect = document.getElementById("standings-select");
standingsSelect.addEventListener("change", (e) => {
  standingsOption = e.target.value;
  updateLeagueBars();
});

const createStandingsOptionSelect = () => {
  for (let i = 0; i < axisOptions.length; i++) {
    const newStangingsOption = document.createElement("option");
    newStangingsOption.text = axisOptions[i];
    newStangingsOption.value = axisOptions[i];

    standingsSelect.appendChild(newStangingsOption);
    if (axisOptions[i] === defaultStanginsOption) {
      newStangingsOption.selected = true;
    }
  }
};

let leagueTableLoaded = false;
// calcTeamMarkVal in
let globalStandings;
async function getStandings() {
  let standings;
  let returnData;
  await fetch(urlPrefix + "/standings/" + seasonId)
    .then((res) => res.json())
    .then((data) => {
      const uniqueStandings = [];
      standings = data.data.standings;
      const teamNamesFound = [];
      for (let i = 0; i < standings.length; i++) {
        if (
          standings[i].teamData &&
          !teamNamesFound.includes(standings[i].teamData.name)
        ) {
          uniqueStandings.push(standings[i]);
          teamNamesFound.push(standings[i].teamData.name);
        }
      }

      globalStandings = uniqueStandings;
      returnData = uniqueStandings;
      return uniqueStandings;
    });
  return returnData;
}
const leagueContainer = document.getElementById("league-container");
const loadLeagueTable = () => {
  if (leagueTableLoaded) {
    getAllMatches().then((matches) => {
      createStackedAreaChart(matches, globalStandings);
    });
    return;
  }

  getStandings().then((standings) => {
    loadLeagueBarPlot(standings);
    leagueTableLoaded = true;
  });
};
