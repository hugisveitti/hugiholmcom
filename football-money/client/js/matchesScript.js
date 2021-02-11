const gameContainer = document.getElementById("game-container");
const matchesUl = document.getElementById("matches-list");
let matchesLoaded = false;
let allMatches;

async function getTeamWithId(teamId) {
  let teamData;
  await fetch(urlPrefix + "/get-team/" + teamId)
    .then((res) => res.json())
    .then((data) => {
      teamData = data;
    });
  return teamData;
}

const getMatchWithId = (id) => {
  gameContainer.classList.remove("hide-card");
  fetch(urlPrefix + "/match/" + id)
    .then((res) => res.json())
    .then((data) => {
      // const homeTeamName = data.match.homeTeam.name;
      //  const awayTeamName = data.match.awayTeam.name;
      const matchData = data.data;
      getTeamWithId(matchData.home_team.team_id).then((homeTeamData) => {
        getTeamWithId(matchData.away_team.team_id).then((awayTeamData) => {
          loadTeamOnScreen(matchData, homeTeamData, awayTeamData);
        });
      });
    });
};

const getMatches = () => {
  if (matchesLoaded) return;

  fetch(urlPrefix + "/matches/" + seasonId)
    .then((res) => res.json())
    .then((data) => {
      const matches = data.data;
      allMatches = matches;
      matches.reverse();
      for (let i = 0; i < matches.length; i++) {
        const newItem = document.createElement("a");

        const homeTeam = matches[i].home_team.name;
        const awayTeam = matches[i].away_team.name;
        const homeScore = matches[i].stats.home_score;
        const awayScore = matches[i].stats.away_score;
        const matchId = matches[i].match_id;
        newItem.classList.add("collection-item");
        const matchDate = matches[i].match_start.substring(0, 10);
        newItem.innerHTML =
          homeTeam +
          " vs. " +
          awayTeam +
          ", " +
          homeScore +
          "-" +
          awayScore +
          ", " +
          matchDate;
        newItem.setAttribute("href", "#game-container");
        newItem.addEventListener("click", () => getMatchWithId(matchId));
        newItem.classList.add("modal-trigger");
        matchesUl.appendChild(newItem);
        matchesLoaded = true;
      }
    });
};
