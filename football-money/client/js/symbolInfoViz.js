const possiblePositions = ["Goal Keeper", "Defender", "Midfielder", "Forward"];
const possiblePosShort = ["GK", "CB", "CAM", "ST"];

const createPlayerSymbolInfo = () => {
  var symbolGenerator = d3.symbol().size(100);

  const margin = { top: 20, right: 30, bottom: 90, left: 0 },
    symbWidth = 700 - margin.left - margin.right,
    symbHeight = 200 - margin.top - margin.bottom;

  const symbolXScale = d3
    .scaleLinear()
    .domain([0, possiblePositions.length - 1])
    .range([0, symbWidth - 200]);

  const symbolSvg = d3
    .select("#symbol_info_dataviz")
    .append("svg")
    .attr("width", symbWidth)
    .attr("height", symbHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  symbolSvg
    .selectAll("symbols")
    .data(possiblePositions)
    .enter()
    .append("path")
    .attr("transform", function (d, i) {
      return "translate(" + (symbolXScale(i) + 30) + ", 0)";
    })
    .attr("d", (d, i) => {
      symbolGenerator.type(
        d3[getPlayerSymbol({ preferred_Position: [possiblePosShort[i]] })]
      );
      return symbolGenerator();
    });

  symbolSvg
    .append("g")
    .selectAll("text")
    .data(possiblePositions)
    .enter()
    .append("text")
    .attr("transform", function (d, i) {
      return "translate(" + symbolXScale(i) + ", 40)";
    })
    .text(function (d) {
      return d;
    });
};
