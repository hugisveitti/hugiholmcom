let sunburstSvg;
let updateSunburst;
let sunburstCreated = false;
let sunburstRoot, sunburstParent, sunburstg, sunburstPath, sunburstLabel;
let sunburstType = "Market Value";
let sunburstLoaded = false;

const trimTeamName = (teamName) => {
  let splitName = teamName.split(" ");
  let trimedTeamName = splitName[0].substring(0, 3);
  let added = 1;
  while (trimedTeamName.length < 9 && splitName.length > added) {
    trimedTeamName = trimedTeamName + " " + splitName[added].substring(0, 3);
    added += 1;
  }
  return trimedTeamName;
};

const preprocessedTeamForSunburstByType = (team, type) => {
  const data = {};
  // const splitName = team.teamData.name.split(" ");
  const trimedTeamName = trimTeamName(team.teamData.name);

  data["name"] = trimedTeamName;
  data["children"] = [];
  for (let i = 0; i < team.playersInfo.length; i++) {
    const splitPlayerName = team.playersInfo[i].Player.split(" ");
    const lastName = splitPlayerName[splitPlayerName.length - 1];
    const playerData = {
      name: lastName,
      value: getValueByType(team.playersInfo[i], type),
    };
    data["children"].push(playerData);
  }
  return data;
};

const preprocessForSunburstDiagramByType = (standings, type) => {
  const data = {};
  data["name"] = leagueName;
  data["children"] = [];
  for (let i = 0; i < standings.length; i++) {
    data["children"].push(
      preprocessedTeamForSunburstByType(standings[i], type)
    );
  }
  return data;
};

const loadSunburstDiagram = (standings) => {
  if (sunburstLoaded) return;
  sunburstLoaded = true;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  let maxWidth = windowWidth > 860 ? 860 : windowWidth - 50;
  let maxHeigth = windowHeight > 860 ? 860 : windowHeight - 50;
  maxWidth = Math.min(maxWidth, maxHeigth);
  maxHeigth = maxWidth;
  const width = maxWidth - margin.left - margin.right;
  const height = maxHeigth - margin.top - margin.bottom;
  const radius = width / 6;

  const partition = (partitionData) => {
    const partitionRoot = d3
      .hierarchy(partitionData)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value);
    return d3.partition().size([2 * Math.PI, partitionRoot.height + 1])(
      partitionRoot
    );
  };

  const arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius((d) => d.y0 * radius)
    .outerRadius((d) => Math.max(d.y0 * radius, d.y1 * radius - 1));

  const arcVisible = (d) => (d.y1 ?? 0) <= 3 && d.y0 >= 1 && d.x1 > d.x0;

  const labelVisible = (d) =>
    d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;

  const labelTransform = (d) => {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = ((d.y0 + d.y1) / 2) * radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
  };

  sunburstSvg = d3
    .select("#teams_players_sunburst")
    .append("svg")
    .attr("id", "sunburst_svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("font", "10px sans-serif");

  updateSunburst = (type) => {
    const data = preprocessForSunburstDiagramByType(standings, type);
    if (sunburstCreated) {
      clicked(sunburstRoot, 1);
      sunburstSvg.selectAll("g").remove();
    }
    sunburstCreated = true;

    const color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 1)
    );

    sunburstRoot = partition(data);
    sunburstRoot.each((d) => (d.current = d));

    sunburstg = sunburstSvg
      .append("g")
      .attr("transform", `translate(${width / 2},${width / 2})`);

    sunburstPath = sunburstg
      .append("g")
      .selectAll("path")
      .data(sunburstRoot.descendants().slice(1))
      // .join("path")
      .enter()
      .append("path")
      .attr("fill", (d) => {
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .attr("fill-opacity", (d) =>
        arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0
      )
      .attr("d", (d) => arc(d.current));

    sunburstPath
      .filter((d) => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    const format = d3.format(",d");

    sunburstPath.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .map((d2) => d2.data.name)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );

    sunburstLabel = sunburstg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(sunburstRoot.descendants().slice(1))
      //.join("text")
      .enter()
      .append("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", (d) => +labelVisible(d.current))
      .attr("transform", (d) => {
        return labelTransform(d.current);
      })
      .text((d) => d.data.name);

    sunburstParent = sunburstg
      .append("circle")
      .datum(sunburstRoot)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    function clicked(event, p) {
      sunburstParent.datum(p.sunburstParent || sunburstRoot);
      p = event;
      sunburstRoot.each(
        (d) =>
          (d.target = {
            x0:
              Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            x1:
              Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) *
              2 *
              Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth),
          })
      );
      const mainT = sunburstg.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      sunburstPath
        .transition(mainT)
        .tween("data", (d) => {
          const i = d3.interpolate(d.current, d.target);

          return (t) => (d.current = i(t));
        })
        .attr("fill-opacity", (d) =>
          arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
        )
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attrTween("d", (d) => () => arc(d.current));

      sunburstLabel
        .attr("fill-opacity", (d) => +labelVisible(d.target))
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        .transition(mainT)
        .attrTween("transform", (d) => () => {
          return labelTransform(d.current);
        });
    }
  };
  updateSunburst(sunburstType);
};

const sunburstSettingButton = document.getElementById(
  "sunburst-setting-button"
);
const sunburstSetting = document.getElementById("sunburst-setting");
sunburstSettingButton.addEventListener("click", () => {
  sunburstSettingButton.innerHTML =
    sunburstType === "Market Value" ? "Use Market Value" : "Use Weekly Salary";
  sunburstType =
    sunburstType === "Market Value" ? "Weekly Salary" : "Market Value";
  sunburstSetting.innerHTML = sunburstType;
  updateSunburst(sunburstType);
});
