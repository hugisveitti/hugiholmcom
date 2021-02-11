// each season has unique id on sportdataapi
let seasonId;
let leagueName;
const urlPrefix = "/footballmoney";
const leagueMode = document.getElementById("league-mode");
const showEPLBtn = document.getElementById("show-epl-btn");
const showBundesligaBtn = document.getElementById("show-bundesliga-btn");
const visualizationMode = document.getElementById("visualization-mode");

showEPLBtn.addEventListener("click", () => {
  seasonId = 352;
  leagueName = "English Premier League";
  leagueMode.classList.add("hide-card");
  visualizationMode.classList.remove("hide-card");
});

showBundesligaBtn.addEventListener("click", () => {
  seasonId = 496;
  leagueName = "Bundesliga";
  leagueMode.classList.add("hide-card");
  visualizationMode.classList.remove("hide-card");
});

window.addEventListener("DOMContentLoaded", (e) => {
  createAxisOptionSelect();
  createStandingsOptionSelect();
  var modalElems = document.querySelectorAll(".modal");
  const modalOptions = {};
  M.Modal.init(modalElems, modalOptions);
  var selectElems = document.querySelectorAll("select");
  M.FormSelect.init(selectElems);
});

const hideContainer = (element) => {
  element.classList.add("hide-card");
};

const leagueInfoBtn = document.getElementById("league-info-btn");
leagueInfoBtn.addEventListener("click", () => {
  hideContainer(matchesContainer);
  hideContainer(playersContainer);
  leagueContainer.classList.remove("hide-card");
  loadLeagueTable();
});

const matchesContainer = document.getElementById("matches-container");

const matchesInfoBtn = document.getElementById("matches-info-btn");
matchesInfoBtn.addEventListener("click", () => {
  matchesContainer.classList.remove("hide-card");

  hideContainer(leagueContainer);
  hideContainer(playersContainer);

  getMatches();
});

const playersInfoBtn = document.getElementById("players-info-btn");
playersInfoBtn.addEventListener("click", () => {
  hideContainer(matchesContainer);
  hideContainer(leagueContainer);
  playersContainer.classList.remove("hide-card");

  loadPlayersPlots();
});

const saveSvg = (svgId, filename) => {
  d3_save_svg.save(d3.select(svgId)._groups[0][0], {
    filename: filename + leagueName,
  });
  alert(
    "Because of a bug, after saving svg you need to do a full page reload."
  );
  window.location.reload();
};
