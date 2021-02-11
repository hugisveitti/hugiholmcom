let playersSvg,
  updatePlayerPlots,
  playerXAxis,
  selected_team,
  mouseX,
  mouseY,
  selectedTeamName = "";

const r2Span = document.getElementById("r2");
const yAxisMeanLabel = document.getElementById("y-axis-mean-label");
const yAxisMean = document.getElementById("y-axis-mean");
const xAxisMeanLabel = document.getElementById("x-axis-mean-label");
const xAxisMean = document.getElementById("x-axis-mean");
const xAxisStd = document.getElementById("x-axis-std");
const yAxisStd = document.getElementById("y-axis-std");

const getHighestValueByType = (players, type) => {
  let highestValue = -1;
  for (let i = 0; i < players.length; i++) {
    highestValue = Math.max(players[i][type] ?? 0, highestValue);
  }
  return highestValue;
};

const getLowestValueByType = (players, type) => {
  let lowestValue = Infinity;
  for (let i = 0; i < players.length; i++) {
    lowestValue = Math.min(players[i][type] ?? lowestValue + 1, lowestValue);
  }
  return lowestValue;
};

const teamColors = possibleColors.slice(0, 20);
// order very important
const getPlayerSymbol = (player) => {
  const pos = player.preferred_Position[0] ?? "";
  if (goalPos.includes(pos)) {
    return symbolTypes[1];
  }
  if (defenderPos.includes(pos)) {
    return symbolTypes[2];
  }
  if (midPos.includes(pos)) {
    return symbolTypes[3];
  }
  if (strikerPos.includes(pos)) {
    return symbolTypes[4];
  }
  return symbolTypes[5];
};

const getMarketValue = (player) => {
  if (!player) return 0;
  const possibleVal = parseInt(player["Market Value"] ?? 0);
  return !isNaN(possibleVal) ? possibleVal : 0;
};

let usePlayersCount = 11;
const getPlayersFromStandings = (standings) => {
  let players = [];
  for (let i = 0; i < standings.length; i++) {
    const teamPlayers = standings[i].playersInfo.sort((a, b) =>
      getMarketValue(a) < getMarketValue(b) ?? 0
        ? 1
        : getMarketValue(b) < getMarketValue(a)
        ? -1
        : 0
    );
    for (let j = 0; j < teamPlayers.length; j++) {
      teamPlayers[j].team_id = standings[i].team_id;
      teamPlayers[j].teamName = standings[i].teamData.name;
    }
    players = players.concat(teamPlayers.slice(0, usePlayersCount));
  }
  return players;
};

const filterValue = (value) => value !== -1 && value !== "";

const filterData = (data, type1, type2) => {
  return data.filter(
    (player) => filterValue(player[type1]) && filterValue(player[type2])
  );
};

const getAllDataByType = (data, type) => {
  const typeData = [];
  for (let i = 0; i < data.length; i++) {
    typeData.push(+data[i][type]);
  }
  return typeData;
};

const showPlayersPlots = (standings) => {
  createPlayerSymbolInfo();

  let possibleTeamIds = standings.map((team) => team.team_id);

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 30, bottom: 90, left: 90 },
    width = 660 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  const unfiltered_data = getPlayersFromStandings(standings);

  // append the playersSvg object to the body of the page
  playersSvg = d3
    .select("#players_dataviz")
    .append("svg")
    .attr("id", "players_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  let color = d3
    .scaleOrdinal()
    .domain(possibleTeamIds)
    .range(d3.schemeCategory20);
  updatePlayerPlots = () => {
    let data = filterData(unfiltered_data, xAxisOption, yAxisOption);
    const highestXAxisValue = getHighestValueByType(data, xAxisOption);
    const lowestXAxisValue = getLowestValueByType(data, xAxisOption);

    const highestYAxisValue = getHighestValueByType(data, yAxisOption);
    const lowestYAxisValue = getLowestValueByType(data, yAxisOption);

    // some data information, such as mean, variance
    const xData = getAllDataByType(data, xAxisOption);
    const yData = getAllDataByType(data, yAxisOption);
    const linReg = linearRegression(xData, yData);
    r2Span.innerHTML = linReg["r2"];
    xAxisMeanLabel.innerHTML = xAxisOption;
    yAxisMeanLabel.innerHTML = yAxisOption;

    const xAxisMeanValue = calcMean(xData);
    const yAxisMeanValue = calcMean(yData);

    xAxisMean.innerHTML = xAxisMeanValue.toLocaleString();
    yAxisMean.innerHTML = yAxisMeanValue.toLocaleString();
    const xAxisStdValue = calcStd(xData, xAxisMeanValue);
    const yAxisStdValue = calcStd(yData, yAxisMeanValue);
    xAxisStd.innerHTML = xAxisStdValue.toLocaleString();
    yAxisStd.innerHTML = yAxisStdValue.toLocaleString();

    playersSvg.selectAll("g.playerXAxis").remove();
    playersSvg.selectAll("path.dot").remove();
    playersSvg.selectAll("g.playerYAxis").remove();
    playersSvg.selectAll("text.yAxisLabel").remove();

    // Y axis
    let playerYAxis = d3
      .scaleLinear()
      .domain([lowestYAxisValue, highestYAxisValue])
      .range([height, 0]);

    // Add Y axis
    playersSvg
      .append("g")
      .attr("class", "playerYAxis")
      .call(d3.axisLeft(playerYAxis));

    // Add X axis
    playerXAxis = d3
      .scaleLinear()
      .domain([lowestXAxisValue, highestXAxisValue])
      .range([0, width]);

    playersSvg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "playerXAxis")
      .call(d3.axisBottom(playerXAxis))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    playersSvg.selectAll(".mean-players-circle").remove();
    playersSvg
      .append("circle")
      .attr("class", "mean-players-circle")
      .attr("cx", playerXAxis(xAxisMeanValue))
      .attr("cy", playerYAxis(yAxisMeanValue))
      .attr("r", 10)
      .style("color", "black");

    const tooltip = d3
      .select("#players_dataviz")
      .append("div")
      .style("position", "absolute")
      //.style("opacity", 0)
      .style("disply", "none")
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    const doNotHighlight = () => {
      // tooltip .transition().duration(200).style("opacity", 0);
      tooltip.style("display", "none");

      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", (d) => color(d.team_id))
        .attr("r", 5);
    };

    const highlight = (d) => {
      selected_team = d.team_id;
      const xValString = (+d[xAxisOption]).toLocaleString();
      tooltip
        .html(
          d.Player +
            "<br />" +
            d.teamName +
            "<br />" +
            "x: " +
            xValString +
            "<br />" +
            "y: " +
            (+d[yAxisOption]).toLocaleString()
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px")
        //.style("opacity", 1)
        .style("display", "block");

      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3);

      d3.selectAll(".team_id" + selected_team)
        .transition()
        .duration(200)
        .style("fill", color(selected_team))
        .attr("r", 7);
    };

    // x axis labels
    // x axis
    const xAxisLabel = xAxisOption; // €";
    playersSvg.selectAll("text.xAxisLabel").remove();
    playersSvg
      .append("text")
      .attr("class", "xAxisLabel")
      .attr(
        "transform",
        "translate(" + width / 2 + " ," + (height + margin.top + 50) + ")"
      )
      .style("text-anchor", "middle")
      .text(xAxisLabel);

    // yLabel
    // text label for the y axis
    const yAxisLabel = yAxisOption;
    playersSvg
      .append("text")
      .attr("class", "yAxisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(yAxisLabel); // add EUR on market value €

    // plot the data
    let symbolGenerator = d3.symbol().size(120);
    let dots = playersSvg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("path")
      .attr("stroke-width", 10)
      .attr("stroke-width", 30)
      .attr("d", (d) => {
        symbolGenerator.type(d3[getPlayerSymbol(d)]);
        return symbolGenerator();
      })
      .attr("transform", function (d) {
        return `translate(${playerXAxis(
          d[xAxisOption]
        )}, ${playerYAxis(d[yAxisOption])})`;
      })
      .attr("class", (d) => "dot team_id" + d.team_id)
      .style("fill", (d) => color(d.team_id));

    dots.merge(dots).transition().duration(1000);
    dots.on("mouseover", highlight);
    dots.on("mouseleave", doNotHighlight);

    playersSvg.selectAll("line.linRegLine").remove();

    playersSvg
      .append("line")
      .attr("class", "linRegLine")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .attr("x1", playerXAxis(lowestXAxisValue))
      .attr("y1", playerYAxis(linReg["func"](lowestXAxisValue)))
      .attr("x2", playerXAxis(highestXAxisValue))
      .attr("y2", playerYAxis(linReg["func"](highestXAxisValue)));
  };
  updatePlayerPlots();
};
