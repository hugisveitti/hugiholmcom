const locale = "en-GB";
const currency = "EUR";

const removeAllChildNodes = (elementId) => {
  const myNode = document.getElementById(elementId);
  while (myNode.firstChild) {
    myNode.removeChild(myNode.lastChild);
  }
};

const getValueByType = (player, type) => {
  if (!player) return 0;
  const possibleVal = parseInt(player[type] ?? 0);
  return !isNaN(possibleVal) ? possibleVal : 0;
};

const sortTeamByType = (team, type) => {
  if (!team || Object.keys(team).length === 0) return undefined;
  return team.sort((a, b) =>
    getValueByType(a, type) < getValueByType(b, type)
      ? 1
      : getValueByType(a, type) > getValueByType(b, type)
      ? -1
      : 0
  );
};

const calcTeamMarketValue = (team, numberOfPlayers = 20) => {
  let marketValue = 0;
  if (!team || Object.keys(team).length === 0) return 0;
  team = sortTeamByType(team, "Market Value");
  for (let i = 0; i < numberOfPlayers ?? team.length; i++) {
    const player = team[i];
    marketValue += getValueByType(player, "Market Value");
  }
  return marketValue;
};

const calcTeamWeeklySalary = (team, numberOfPlayers = 20) => {
  let totalSalary = 0;
  for (let i = 0; i < numberOfPlayers ?? team.length; i++) {
    const player = team[i];
    totalSalary += getValueByType(player, "Weekly Salary");
  }
  return totalSalary;
};

const getMostExpensivePlayer = (team) => {
  let mostExpensivePlayer;
  let mostExpensiveMarketValue;
  for (let i = 0; i < team.length; i++) {
    if (!mostExpensivePlayer) {
      mostExpensivePlayer = team[i];
      mostExpensiveMarketValue = getValueByType(team[i], "Market Value");
    } else {
      let marketValue = getValueByType(team[i], "Market Value");
      if (marketValue > mostExpensiveMarketValue) {
        mostExpensivePlayer = team[i];
        mostExpensiveMarketValue = marketValue;
      }
    }
  }
  return mostExpensivePlayer;
};

const homeTeamTitle = document.getElementById("home-team-title");
const awayTeamTitle = document.getElementById("away-team-title");
const gameScore = document.getElementById("game-score");
const gameDay = document.getElementById("game-day");

const loadTeamOnScreen = (matchData, homeTeamData, awayTeamData) => {
  homeTeamTitle.innerHTML = matchData.home_team.name;
  awayTeamTitle.innerHTML = matchData.away_team.name;
  const awayTeamValue = calcTeamMarketValue(awayTeamData);
  const homeTeamValue = calcTeamMarketValue(homeTeamData);

  const homeTeamSalaryValue = calcTeamWeeklySalary(homeTeamData);
  const awayTeamSalaryValue = calcTeamWeeklySalary(awayTeamData);
  const score = matchData.stats?.ft_score?.split("-");
  gameScore.innerHTML = matchData.stats?.ft_score ?? "game results not found";
  gameDay.innerHTML = matchData.match_start.substring(0, 10);
  const homeTeamGoals = parseInt(score?.[0] ?? 0);
  const awayTeamGoals = parseInt(score?.[1] ?? 0);
  const data1 = [
    {
      group: matchData.home_team.name,
      value: homeTeamValue,
    },
    {
      group: matchData.away_team.name,
      value: awayTeamValue,
    },
  ];
  const data2 = [
    {
      group: matchData.home_team.name,
      value: homeTeamSalaryValue,
    },
    {
      group: matchData.away_team.name,
      value: awayTeamSalaryValue,
    },
  ];
  const data3 = [
    {
      group: matchData.home_team.name,
      value: homeTeamValue / (homeTeamGoals !== 0 ? homeTeamGoals : 0.5),
    },
    {
      group: matchData.away_team.name,
      value: awayTeamValue / (awayTeamGoals !== 0 ? awayTeamGoals : 0.5),
    },
  ];

  const homePlayer = getMostExpensivePlayer(homeTeamData);
  const awayPlayer = getMostExpensivePlayer(awayTeamData);
  const homePlayerValue = getValueByType(homePlayer, "Market Value");
  const awayPlayerValue = getValueByType(awayPlayer, "Market Value");

  const data4 = [
    {
      group: homePlayer.Player,
      value: homePlayerValue,
    },
    {
      group: awayPlayer.Player,
      value: awayPlayerValue,
    },
  ];

  let lessExpensiveTeamValue;
  let lessExpensiveTeamName;
  if (awayTeamValue > homeTeamValue) {
    lessExpensiveTeamValue = homeTeamValue;
    lessExpensiveTeamName = matchData.home_team.name;
  } else {
    lessExpensiveTeamValue = awayTeamValue;
    lessExpensiveTeamName = matchData.away_team.name;
  }
  const moreExpensivePlayer =
    homePlayerValue > awayPlayerValue ? homePlayer : awayPlayer;

  const teamVsPlayerData = [
    {
      group: lessExpensiveTeamName,
      value: lessExpensiveTeamValue,
    },
    {
      group: moreExpensivePlayer.Player,
      value: getValueByType(moreExpensivePlayer, "Market Value"),
    },
  ];

  removeAllChildNodes("match_dataviz");
  removeAllChildNodes("player_match_dataviz");
  removeAllChildNodes("player_vs_team_match_dataviz");
  loadTeamBarPlot(data1, data2, data3, data4, teamVsPlayerData);
};
