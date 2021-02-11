let updateTeamBars, teamSvg, teamBarYAxis;
const loadTeamBarPlot = (
  data1,
  data2,
  data3,
  expensivePlayersData,
  teamVsPlayerData
) => {
  loadPlayerMatchPlot(expensivePlayersData);
  plotTeamVsPlayer(teamVsPlayerData);
  // create 2 data_set

  // set the dimensions and margins of the graph
  const windowWidth = window.innerWidth;
  const maxWidth = windowWidth > 460 ? 460 : windowWidth - 50;
  const maxHeigth = window.innerHeight > 400 ? 400 : windowHeight - 50;
  var margin = { top: 30, right: 30, bottom: 70, left: 90 },
    width = maxWidth - margin.left - margin.right,
    height = maxHeigth - margin.top - margin.bottom;

  // append the svg object to the body of the page
  teamSvg = d3
    .select("#match_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      data1.map(function (d) {
        return d.group;
      })
    )
    .padding(0.2);
  teamSvg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  //teamBarYAxis = d3.scaleLinear().domain([0, 500000000]).range([height, 0]);
  // teamSvg.append("g").attr("class", "myteamBarYAxis").call(d3.axisLeft(teamBarYAxis));

  // A function that create / update the plot for a given variable:
  updateTeamBars = (dataName) => {
    let data;
    if (dataName === "data1") {
      data = data1;
    } else if (dataName === "data2") {
      data = data2;
    } else if (dataName === "Market value / goals") {
      data = data3;
    }
    teamBarYAxis = d3
      .scaleLinear()
      .domain([0, Math.max(data[0].value, data[1].value)])
      .range([height, 0]);

    teamSvg.selectAll("g.myteamBarYAxis").remove();
    teamSvg
      .append("g")
      .attr("class", "myteamBarYAxis")
      .call(d3.axisLeft(teamBarYAxis));

    let u = teamSvg.selectAll("rect").data(data);

    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("x", function (d) {
        return x(d.group);
      })
      .attr("y", function (d) {
        return teamBarYAxis(d.value);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return height - teamBarYAxis(d.value);
      })
      .attr("fill", "#69b3a2");
  };
  // Initialize the plot with the first dataset
  updateTeamBars("data1");
};

const loadPlayerMatchPlot = (expensivePlayersData) => {
  const windowWidth = window.innerWidth;
  const maxWidth = windowWidth > 460 ? 460 : windowWidth - 50;
  const maxHeigth = window.innerHeight > 400 ? 400 : windowHeight - 50;
  var margin = { top: 30, right: 30, bottom: 70, left: 90 },
    width = maxWidth - margin.left - margin.right,
    height = maxHeigth - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const expensvePlayerSvg = d3
    .select("#player_match_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      expensivePlayersData.map(function (d) {
        return d.group;
      })
    )
    .padding(0.2);

  expensvePlayerSvg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  const expensvePlayerYAxis = d3
    .scaleLinear()
    .domain([
      0,
      Math.max(expensivePlayersData[0].value, expensivePlayersData[1].value),
    ])
    .range([height, 0]);

  expensvePlayerSvg.selectAll("g.expensvePlayerYAxis").remove();
  expensvePlayerSvg
    .append("g")
    .attr("class", "expensvePlayerYAxis")
    .call(d3.axisLeft(expensvePlayerYAxis));

  let u = expensvePlayerSvg.selectAll("rect").data(expensivePlayersData);

  u.enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("y", function (d) {
      return expensvePlayerYAxis(d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - expensvePlayerYAxis(d.value);
    })
    .attr("fill", "#69b3a2");
};

const plotTeamVsPlayer = (teamVsPlayerData) => {
  const windowWidth = window.innerWidth;
  const maxWidth = windowWidth > 460 ? 460 : windowWidth - 50;
  const maxHeigth = window.innerHeight > 400 ? 400 : windowHeight - 50;
  var margin = { top: 30, right: 30, bottom: 70, left: 90 },
    width = maxWidth - margin.left - margin.right,
    height = maxHeigth - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const teamVsPlayerSvg = d3
    .select("#player_vs_team_match_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(
      teamVsPlayerData.map(function (d) {
        return d.group;
      })
    )
    .padding(0.2);

  teamVsPlayerSvg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  const teamVsPlayerYAxis = d3
    .scaleLinear()
    .domain([0, Math.max(teamVsPlayerData[0].value, teamVsPlayerData[1].value)])
    .range([height, 0]);

  teamVsPlayerSvg.selectAll("g.teamVsPlayerSvgYAxis").remove();
  teamVsPlayerSvg
    .append("g")
    .attr("class", "teamVsPlayerYAxis")
    .call(d3.axisLeft(teamVsPlayerYAxis));

  let u = teamVsPlayerSvg.selectAll("rect").data(teamVsPlayerData);

  u.enter()
    .append("rect")
    .merge(u)
    .transition()
    .duration(1000)
    .attr("x", function (d) {
      return x(d.group);
    })
    .attr("y", function (d) {
      return teamVsPlayerYAxis(d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - teamVsPlayerYAxis(d.value);
    })
    .attr("fill", "#69b3a2");
};
