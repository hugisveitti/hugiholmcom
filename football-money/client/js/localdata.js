const symbolTypes = [
  "symbolCircle",
  "symbolCross",
  "symbolDiamond",
  "symbolSquare",
  "symbolStar",
  "symbolTriangle",
  "symbolWye",
];
const allPositions = [
  "CAM",
  "CM",
  "RCM",
  "LM",
  "ST",
  "Sub",
  "CDM",
  "RB",
  "RWB",
  "GK",
  "CB",
  "LCB",
  "LDM",
  "LW",
  "RW",
  "LCM",
  "RM",
  "LB",
  "LWB",
  "CF",
  "RCB",
  "RS",
  "RDM",
  "Res",
  "LS",
];

const goalPos = ["GK"]; // 1
const defenderPos = [
  "CB",
  "LB",
  "RB",
  "LWB",
  "RWB",
  "SW",
  "LCB",
  "RCB",
  "RDM",
  "LDM",
]; // 10
const midPos = ["DM", "CM", "AM", "LM", "RM", "CAM", "CDM", "CM", "LCM"]; // 6
const strikerPos = ["CF", "ST", "SS", "LS", "RS", "RW", "LW"]; // 7

const possibleColors = [
  "#330000",
  "#ff5940",
  "#ffc8bf",
  "#8c3800",
  "#ccad99",
  "#ffa640",
  "#33260d",
  "#f2c200",
  "#66571a",
  "#736d56",
  "#b9bf60",
  "#b8e600",
  "#448000",
  "#194000",
  "#00f241",
  "#60bf79",
  "#26332d",
  "#006652",
  "#00ffee",
  "#60b9bf",
  "#00ccff",
  "#69858c",
  "#0d2633",
  "#3d9df2",
  "#537fa6",
  "#333a66",
  "#7960bf",
  "#462080",
  "#c3ace6",
  "#8100f2",
  "#260d33",
  "#d936b8",
  "#994d8a",
  "#e5005c",
  "#f2b6ce",
  "#8c0013",
  "#cc6674",
  "#733941",
];

const axisOptions = [
  "Market Value",
  "Weekly Salary",
  "height",
  "weight",
  "age",
  "kit number",
  "dribbling",
  "ball control",
  "marking",
  "slide tackle",
  "stand tackle",
  "aggression",
  "reactions",
  "attack_position",
  "interceptions",
  "vision",
  "composure",
  "crossing",
  "short pass",
  "long pass",
  "acceleration",
  "stamina",
  "strength",
  "balance",
  "sprint speed",
  "agility",
  "jumping",
  "heading",
  "shot power",
  "finishing",
  "long shots",
  "curve",
  "FK acc",
  "penalties",
  "volleys",
  "GK positioning",
  "GK diving",
  "GK handling",
  "GK kicking",
  "GK reflexes",
];

/**
GETTING ALL POS   
   let allPos = [];
 for (let i = 0; i < data.length; i++) {
   let player = data[i];
    for (let j = 0; j < player.Preferred_Position.length; j++) {
      let pos = player.Preferred_Position[j];
      if (!allPos.includes(pos)) {
        allPos.push(pos);
      }
    }
  }
  */
