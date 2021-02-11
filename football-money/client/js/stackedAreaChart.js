let stackedLoaded = false;
// for some reason the names are different and I dont want to deal with it more complex
const getTeamNameFunction = (teamName) => {
  if (teamName === "FC Bayern Munchen") return "FC Bayern Munich";
  if (teamName === "Sport-Club Freiburg") return "SC Freiburg";
  if (teamName === "SV Werder Bremen") return "Werder Bremen";
  if (teamName === "Hertha Berlin") return "Hertha BSC";
  if (teamName === "1. FC Köln") return "1. FC Cologne";
  if (teamName === "TSG Hoffenheim") return "TSG 1899 Hoffenheim";

  return teamName;
};

const getTeamTotalByType = (standings, type) => {
  const allTeamMarketValues = {};
  for (let i = 0; i < standings.length; i++) {
    allTeamMarketValues[getTeamNameFunction(standings[i].teamData.name)] =
      standings[i].teamData[type];
  }
  return allTeamMarketValues;
};
let gloabalAllTeamNames;
const preprocessForStacked = (matches, standings) => {
  const roundsObj = {};

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (match.status === "finished") {
      const homeTeam = match.home_team.name;
      const awayTeam = match.away_team.name;
      const awayGoals = match.stats.away_score;
      const homeGoals = match.stats.home_score;
      const roundNr = +match.round.name;

      if (!(roundNr in roundsObj)) {
        roundsObj[roundNr] = {};
      }

      if (awayGoals > homeGoals) {
        roundsObj[roundNr][homeTeam] = 0;
        roundsObj[roundNr][awayTeam] = 3;
      } else if (awayGoals < homeGoals) {
        roundsObj[roundNr][homeTeam] = 3;
        roundsObj[roundNr][awayTeam] = 0;
      } else {
        roundsObj[roundNr][homeTeam] = 1;
        roundsObj[roundNr][awayTeam] = 1;
      }
    }
  }
  const allTeamNames = Object.keys(roundsObj[1]); // assume round1 finished
  gloabalAllTeamNames = allTeamNames;
  let rounds = [];
  const keys = Object.keys(roundsObj);
  for (let i = 0; i < keys.length; i++) {
    if (i === 0) {
      rounds.push(roundsObj[keys[i]]);
    } else {
      const roundObj = {};
      for (let j = 0; j < allTeamNames.length; j++) {
        const team = allTeamNames[j];
        const currRoundScore =
          team in roundsObj?.[keys[i]] ? roundsObj[keys[i]][team] : 0;
        const lastRoundScore = rounds[i - 1][team];
        roundObj[team] = lastRoundScore + currRoundScore;
      }
      rounds.push(roundObj);
    }
  }
  const type = "Market Value";
  const totalMarketValue = getTeamTotalByType(standings, type);
  rounds.push(totalMarketValue);
  const totalWeeklyValue = getTeamTotalByType(standings, "Weekly Salary");

  rounds.push(totalWeeklyValue);

  rounds["columns"] = allTeamNames;

  return rounds;
};

const createStackedAreaChart = (matches, standings) => {
  if (stackedLoaded) return;
  stackedLoaded = true;
  const rounds = preprocessForStacked(matches.data, standings);

  const margin = { top: 30, right: 20, bottom: 50, left: 80 };
  const width = 800;
  const height = 800;
  const nrRounds = rounds.length - 2;

  const series = d3
    .stack()
    .keys(rounds.columns.slice(0))
    .offset(d3.stackOffsetExpand)(rounds);

  const y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

  const myXTicks = (i) => {
    return i + 1;
    if (i <= nrRounds) return i + 1;
    if (i === nrRounds + 1) return "Market Value";
    return "Weekly Salary";
  };

  const x = d3
    .scaleLinear()
    .domain(d3.extent(rounds, (d, i) => myXTicks(i)))
    .range([margin.left, width - margin.right]);
  const area = d3
    .area()
    .x((d, i) => x(myXTicks(i)))
    .y0((d) => {
      return y(d[0]);
    })
    .y1((d) => y(d[1]));

  const color = d3
    .scaleOrdinal()
    .domain(rounds.columns.slice(1))
    //  .range(d3.interpolatePRGn(rounds["columns"].length));
    .range(d3.schemeCategory20);

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(10, "%"))
      .call((g2) => g2.select(".domain").remove());

  const xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom})`).call(
      d3
        .axisBottom(x)
        // .ticks((d, i) => i)
        .ticks(width / 80)
        .tickSizeOuter(0)
    );

  const stackedSvg = d3
    .select("#league_stacked_dataviz")
    .append("svg")
    .attr("id", "league_stacked_svg")
    .attr("width", width)
    .attr("height", height + 10);

  stackedSvg
    .append("g")
    .selectAll("path")
    .data(series)
    //.join("path")
    .enter()
    .append("path")
    .attr("fill", ({ key }) => color(key))
    .attr("d", area)
    .append("title")
    .text(({ key }) => {
      return key;
    });

  stackedSvg.append("g").call(xAxis);

  stackedSvg.append("g").call(yAxis);

  stackedSvg
    .append("line")
    .attr("class", "end-of-rounds-line")
    .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("x1", x(nrRounds))
    .attr("y1", y(0))
    .attr("x2", x(nrRounds))
    .attr("y2", y(1));

  // XLabel
  const xAxisLabel =
    "Round number of " +
    nrRounds +
    " rounds and then Market Value and Weekly Salary";
  stackedSvg
    .append("text")
    .attr("class", "xAxisLabel")
    .attr("transform", "translate(" + width / 2 + " ," + height + ")")
    .style("text-anchor", "middle")
    .text(xAxisLabel);

  const svgTitle =
    "Normalized accumalted score in league and normalized Market Value and Weekly Salary after the black line";
  stackedSvg
    .append("text")
    .attr("class", "xAxisLabel")
    .attr(
      "transform",
      "translate(" + width / 2 + " ," + (margin.top - 10) + ")"
    )
    .style("text-anchor", "middle")
    .text(svgTitle);

  const yAxisLabel = "% of all teams";
  stackedSvg
    .append("text")
    .attr("class", "yAxisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text(yAxisLabel); // add EUR on market value €

  const stackedInfo = document.getElementById("stacked-info");

  const revteams = rounds["columns"].reverse();
  for (let i = 0; i < revteams.length; i++) {
    const teamItem = revteams[i];
    const item = document.createElement("div");
    item.classList.add("stacked-info-item");

    const label = document.createElement("div");
    label.classList.add("stacked-info-label");
    label.innerHTML = teamItem;

    const square = document.createElement("div");
    square.classList.add("stacked-info-square");
    square.style.backgroundColor = color(teamItem);

    item.appendChild(square);
    item.appendChild(label);
    stackedInfo.appendChild(item);
  }
};
