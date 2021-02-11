// TODO: only plot top 11 most expensive or top 20 most expensive
// some teams have more players

let updateLeagueBars, leagueSvg, leagueBarXAxis;

const leagueVizInfo = document.getElementById("league-viz-info");

const getHighestTeamValueByType = (standings, type) => {
  let highestValue = -1;
  for (let i = 0; i < standings.length; i++) {
    highestValue = Math.max(standings[i].teamData[type], highestValue);
  }
  return highestValue;
};

const getLowestTeamValueByType = (standings, type) => {
  let lowestValue = Infinity;
  for (let i = 0; i < standings.length; i++) {
    lowestValue = Math.min(standings[i].teamData[type], lowestValue);
  }
  return lowestValue;
};

const calcTeamSumOfType = (team, type) => {
  let sum = 0;
  for (let i = 0; i < team.playersInfo.length; i++) {
    sum += getValueByType(team.playersInfo[i], type);
  }
  team.teamData[type] = sum;
};

const numberOfPlayers = 11;
const getNHighestValueByType = (standings, type) => {
  const temp = JSON.stringify(standings);
  const newStandings = JSON.parse(temp);
  for (let i = 0; i < newStandings.length; i++) {
    const teamPlayers = newStandings[i].playersInfo.sort((a, b) =>
      getValueByType(a, type) < getValueByType(b, type) ?? 0
        ? 1
        : getValueByType(b, type) < getValueByType(a, type)
        ? -1
        : 0
    );
    newStandings[i].playersInfo = teamPlayers.splice(0, numberOfPlayers);
    calcTeamSumOfType(newStandings[i], type);
  }
  return newStandings;
};

const loadLeagueBarPlot = (allStandings) => {
  loadHorizonChart(allStandings);

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 30, bottom: 70, left: 80 },
    width = 660 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // append the leagueSvg object to the body of the page
  leagueSvg = d3
    .select("#league_dataviz")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.bottom + margin.top)
    .attr("id", "league_svg")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Y axis
  let y = d3
    .scaleBand()
    .range([0, height])
    .domain(
      allStandings.map(function (d) {
        return trimTeamName(d.teamData.name);
      })
    )
    .padding(0.1);

  leagueSvg.append("g").call(d3.axisLeft(y));
  updateLeagueBars = () => {
    let currType = standingsOption;

    // plotSalaryBtn.innerHTML = "Plot " + stapingsOption; // market value";
    leagueVizInfo.innerHTML =
      "League standings vs. summed " + currType + " of team";

    let standings = getNHighestValueByType(allStandings, "Market Value");
    standings = getNHighestValueByType(allStandings, currType);

    const highestValue = getHighestTeamValueByType(standings, currType);
    standings = getNHighestValueByType(standings, "Weekly Salary");
    const lowestValue = getLowestTeamValueByType(standings, currType);

    // xAxis label
    const xAxisLabel = "Total " + standingsOption; // doPlotSalary ? "Weekly salary" : "Market value";
    leagueSvg.selectAll("text.xAxisLabel").remove();
    leagueSvg
      .append("text")
      .attr("class", "xAxisLabel")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 45) + ")"
      )
      .style("text-anchor", "middle")
      .text(xAxisLabel);

    const xAxisStart = lowestValue * (lowestValue / highestValue);
    // Add X axis
    leagueBarXAxis = d3
      .scaleLinear()
      .domain([xAxisStart, highestValue])
      .range([0, width]);

    leagueSvg.selectAll("g.leagueBarXAxis").remove();
    leagueSvg
      .append("g")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .attr("class", "leagueBarXAxis")
      .call(d3.axisBottom(leagueBarXAxis))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    let u = leagueSvg.selectAll("rect").data(standings);
    //Bars
    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("x", leagueBarXAxis(xAxisStart))
      .attr("y", (d) => y(trimTeamName(d.teamData.name)))
      .attr("width", (d) => {
        return leagueBarXAxis(d.teamData[currType]);
      })
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2");

    getAllMatches().then((matches) => {
      createStackedAreaChart(matches, standings);
    });
  };
  updateLeagueBars();
  // call after the "Market value" has been created for team
};
