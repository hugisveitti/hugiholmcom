const isForward = (player) => {
  for (let i = 0; i < player.preferred_Position.length; i++) {
    if (strikerPos.includes(player.preferred_Position[i])) {
      return true;
    }
  }
  return false;
};

const findStrikers = (team, type, team11) => {
  let allStrikers = [];
  for (let i = 0; i < team.playersInfo.length; i++) {
    const player = team.playersInfo[i];
    if (isForward(player) && !team11.includes(player)) {
      allStrikers.push(player);
    }
  }
  allStrikers = sortTeamByType(allStrikers, type);
  return allStrikers.slice(0, 2);
};

const isMidfielder = (player) => {
  for (let i = 0; i < player.preferred_Position.length; i++) {
    if (midPos.includes(player.preferred_Position[i])) {
      return true;
    }
  }
  return false;
};

const findMidfielders = (team, type, team11) => {
  let allMidfielders = [];
  for (let i = 0; i < team.playersInfo.length; i++) {
    const player = team.playersInfo[i];
    if (isMidfielder(player) && !(player in team11)) {
      allMidfielders.push(player);
    }
  }
  allMidfielders = sortTeamByType(allMidfielders, type);
  return allMidfielders.slice(0, 4);
};

const findDefenders = (team, type) => {
  let allDefenders = [];
  for (let i = 0; i < team.playersInfo.length; i++) {
    const player = team.playersInfo[i];
    if (defenderPos.includes(player.preferred_Position[0])) {
      allDefenders.push(player);
    }
  }
  allDefenders = sortTeamByType(allDefenders, type);
  return allDefenders.slice(0, 4);
};

// returns
const findGoalKeeper = (team, type) => {
  let goalKeeper;
  for (let i = 0; i < team.playersInfo.length; i++) {
    const player = team.playersInfo[i];
    if (goalPos.includes(player.preferred_Position[0])) {
      if (
        !goalKeeper ||
        getValueByType(goalKeeper, type) < getValueByType(player, type)
      ) {
        goalKeeper = player;
      }
    }
  }
  return [goalKeeper];
};

// find top 11 players by type
// 1 GK
// 4 defence
// 4 mid
// 2 attack
const preprocessForHorizonChart = (standings, type) => {
  const preprocessedTeams = [];
  for (let i = 0; i < standings.length; i++) {
    const team = standings[i];
    const goalKeeper = findGoalKeeper(team, type);
    let team11 = goalKeeper;
    const defenders = findDefenders(team, type);
    team11 = team11.concat(defenders);
    const midfielders = findMidfielders(team, type, team11);
    team11 = team11.concat(midfielders);
    const strikers = findStrikers(team, type, team11);
    team11 = team11.concat(strikers);

    const preprocessedTeam = {
      name: team.teamData.name,
      team: team11,
    };
    preprocessedTeam[type] = team11.map((player) => player[type]);
    preprocessedTeams.push(preprocessedTeam);
  }
  return preprocessedTeams;
};

const getHighestAndLowestTeamValueByType = (teams, type) => {
  let lowest = Infinity;
  let highest = -1;
  for (let i = 0; i < teams.length; i++) {
    const team = teams[i].team;
    for (let j = 0; j < team.length; j++) {
      const playerValue = getValueByType(team[i], type);
      lowest = Math.min(lowest, playerValue);
      highest = Math.max(highest, playerValue);
    }
  }
  return [highest, lowest];
};

// ridgedLinePlot
const horizonPositions = [
  "GK",
  "DF1",
  "DF2",
  "DF3",
  "DF4",
  "MID1",
  "MID2",
  "MID3",
  "MID4",
  "FW1",
  "FW2",
];
const loadHorizonChart = (standings) => {
  const type = "Market Value";
  const teams = preprocessForHorizonChart(standings, type);
  const margin = { top: 100, right: 20, bottom: 20, left: 80 };
  const width = 800;
  const height = 800;
  const overlap = 1;

  const x = d3
    .scaleBand()
    .range([margin.left, width - margin.right])
    .domain(
      horizonPositions.map((d) => {
        return d;
      })
    );
  const y = d3
    .scalePoint()
    .domain(teams.map((d) => trimTeamName(d.name)))
    .range([margin.top, height - margin.bottom]);

  const [highestValue, lowestValue] = getHighestAndLowestTeamValueByType(
    teams,
    type
  );
  const z = d3
    .scaleLinear()
    .domain([lowestValue, highestValue])
    .nice()
    .range([0, -overlap * y.step()]);
  const xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        .ticks(width / 80)
        .tickSizeOuter(0)
    );

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
      .call((g2) => g2.select(".domain").remove());

  const area = d3
    .area()
    .curve(d3.curveBasis)
    .x((d, i) => {
      return x(horizonPositions[i]);
    })
    .y0(0)
    .y1((d) => {
      return z(d);
    });

  const line = area.lineY1();
  const chartSvg = d3
    .select("#league_horizon_dataviz")
    .append("svg")
    .attr("id", "league_horizon_svg")
    .attr("width", width)
    .attr("height", height);

  chartSvg.append("g").append("g").call(xAxis);

  const group = chartSvg
    .append("g")
    .selectAll("g2")
    .data(teams)
    //.join("g")
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(25,${y(trimTeamName(d.name)) + 1})`);

  group
    .append("path")
    .attr("fill", "#ddd")
    .attr("d", (d) => area(d[type]));

  group
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", (d) => line(d[type]));

  chartSvg.append("g").call(yAxis);
};
