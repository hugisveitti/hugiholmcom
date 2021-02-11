const request = require("request");
const APIKEY_SPORTDATA = "2c3cf2a0-4841-11eb-ad89-e3382118aa99";
const englishTeams = require("./englishTeams.json");
const germanTeams = require("./germanTeams.json");
const englandCountryId = 42;
const spainCountryId = 113;
const germanyCountryId = 48;
const bundesligaSeasonId = 496;
const EPLSeasonId = 352;
const bundesligaId = 314;
let englishMatches;
let germanMatches;

const options = (url) => ({
  //   headers: { "X-Auth-Token": APIKEY_SPORTDATA },
  dataType: "json",
  type: "Get",
  url,
});

// [{"league_id":237,"country_id":42,"name":"Premier League"},{"league_id":538,"country_id":113,"name":"LaLiga"}]
// {"season_id":352,"name":"20\/21","is_current":1,"country_id":42,"league_id":237,"start_date":"2020-09-11","end_date":"2021-05-24"}
// {"league_id":314,"country_id":48,"name":"Bundesliga"}
// bundesliga : {"season_id":496,"name":"20\/21","is_current":1,"country_id":48,"league_id":314,"start_date":"2020-09-18","end_date":"2021-05-29"}
module.exports = function (app, getTeamPlayers, urlPrefix) {
  app.get(urlPrefix + "get-team/:teamId", (req, res) => {
    // TODO FIX
    const teamId = +req.params.teamId;
    let team = findTeam(englishTeams, { team_id: teamId });
    if (team === undefined) {
      team = findTeam(germanTeams, { team_id: teamId });
    }
    if (team === undefined) {
      console.log("team", req.params.teamId, "not found");
      res.send({});
      return;
    }
    const teamResult = getTeamPlayers(team.name);
    res.send(teamResult);
  });

  const getSeason = (leagueId, res) => {
    const url = `https://app.sportdataapi.com/api/v1/soccer/seasons?apikey=${APIKEY_SPORTDATA}&league_id=${leagueId}`;
    request(options(url), (err, apiRes, body) => {
      res.send(body);
    });
  };

  app.get(urlPrefix + "seasons/:leagueId", (req, res) => {
    getSeason(req.params.leagueId, res);
  });
  // getSeason(237);

  const getMatches = async (seasonId, res, callBack) => {
    const dateTo = new Date().toISOString().substr(0, 10);
    const url = `https://app.sportdataapi.com/api/v1/soccer/matches?apikey=${APIKEY_SPORTDATA}&season_id=${seasonId}&status_id=3&date_to=${dateTo}`;
    request(options(url), (err, apiRes, body) => {
      const newBody = JSON.parse(body);
      newBody.query = undefined;
      if (seasonId === EPLSeasonId) {
        englishMatches = newBody;
      } else if (seasonId === bundesligaSeasonId) {
        germanMatches = newBody;
      }
      if (res) {
        res.send(newBody);
      } else if (callBack) {
        callBack(newBody);
      }
    });
  };
  app.get(urlPrefix + "matches/:seasonId", (req, res) => {
    const seasonId = +req.params.seasonId;
    if (englishMatches && seasonId === EPLSeasonId) {
      res.send(englishMatches);
    } else if (germanMatches && seasonId === bundesligaSeasonId) {
      res.send(germanMatches);
    } else {
      getMatches(seasonId, res);
    }
  });

  // getMatches(352);
  const randMatchId = 165878;
  const getMatch = (matchId, res) => {
    const url = `https://app.sportdataapi.com/api/v1/soccer/matches/${matchId}?apikey=${APIKEY_SPORTDATA}`;
    request(options(url), (err, apiRes, body) => {
      let newBody = JSON.parse(body);
      newBody.query = undefined;
      res.send(JSON.stringify(newBody));
    });
  };
  app.get(urlPrefix + "match/:id", (req, res) => {
    const matchId = +req.params.id;
    getMatch(matchId, res);
  });
  // getMatch(randMatchId);

  const getLeagues = (res) => {
    const url = `https://app.sportdataapi.com/api/v1/soccer/leagues?apikey=${APIKEY_SPORTDATA}&subscribed=true`;
    request(options(url), (err, apiRes, body) => {
      let newBody = JSON.parse(body);
      newBody.query = undefined;
      res.send(JSON.stringify(newBody));
    });
  };

  app.get(urlPrefix + "leagues", (req, res) => {
    getLeagues(res);
  });

  const findTeam = (teamsData, team) => {
    const teams = teamsData.data;
    for (let i = 0; i < teams.length; i++) {
      if (team.team_id === teams[i].team_id) {
        return teams[i];
      }
    }
    return undefined;
  };

  let englishStandings;
  let germanStandings;
  const getStandings = (seasonId, res) => {
    const url = `https://app.sportdataapi.com/api/v1/soccer/standings?apikey=${APIKEY_SPORTDATA}&season_id=${seasonId}`;
    request(options(url), (err, apiRes, body) => {
      const data = JSON.parse(body);
      let teams;
      if (seasonId === 352) {
        teams = englishTeams;
      } else {
        teams = germanTeams;
      }

      const standings = data.data.standings;
      for (let i = 0; i < standings.length; i++) {
        standings[i].teamData = findTeam(teams, standings[i]);
        const teamData = standings[i].teamData;
        if (teamData && teamData.name) {
          standings[i].playersInfo = getTeamPlayers(teamData.name);
        }
      }

      data.query = undefined;
      if (seasonId === EPLSeasonId) {
        englishStandings = data;
      } else if (seasonId === bundesligaSeasonId) {
        germanStandings = data;
      }
      res.send(data);
    });
  };

  app.get(urlPrefix + "standings/:seasonId", (req, res) => {
    const seasonId = +req.params.seasonId;
    if (seasonId === EPLSeasonId && englishStandings) {
      res.send(englishStandings);
    } else if (germanStandings && seasonId === bundesligaSeasonId) {
      res.send(germanStandings);
    } else {
      getStandings(seasonId, res);
    }
  });

  app.get(urlPrefix + "teams/:countryId", (req, res) => {
    const countryId = +req.params.countryId;
    const url = `https://app.sportdataapi.com/api/v1/soccer/teams?apikey=${APIKEY_SPORTDATA}&country_id=${countryId}`;
    request(options(url), (err, apiRes, body) => {
      let newBody = JSON.parse(body);
      newBody.query = undefined;
      res.send(JSON.stringify(newBody));
    });
  });

  // 12295 12294 not found
  app.get(urlPrefix + "team", (req, res) => {
    const teamId = 12294;
    const url = `https://app.sportdataapi.com/api/v1/soccer/teams/${teamId}?apikey=${APIKEY_SPORTDATA}`;
    request(options(url), (err, apiRes, body) => {
      let newBody = JSON.parse(body);
      newBody.query = undefined;
      res.send(JSON.stringify(newBody));
    });
  });

  const findAllTeamsMatchesAndSend = (teamId, matchesData, res) => {
    const teamMatches = [];
    const matches = matchesData.data;
    for (let i = 0; i < matches.length; i++) {
      if (
        matches[i].home_team.team_id === teamId ||
        matches[i].away_team.team_id === teamId
      ) {
        teamMatches.push(matches[i]);
      }
    }
    res.send(teamMatches);
  };

  app.get(urlPrefix + "getallatches/:seasonId", (req, res) => {
    const seasonId = +req.params.seasonId;
    if (englishMatches && seasonId === EPLSeasonId) {
      res.send(englishMatches);
      // findAllTeamsMatchesAndSend(teamId, englishMatches, res);
    } else if (germanMatches && seasonId === bundesligaSeasonId) {
      res.send(germanMatches);
      // findAllTeamsMatchesAndSend(teamId, germanMatches, res);
    } else {
      getMatches(seasonId, undefined, (matches) => {
        // findAllTeamsMatchesAndSend(teamId, matches, res);
        res.send(matches);
      });
    }
  });
};
