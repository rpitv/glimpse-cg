import { replicants } from "~/utils/replicants";

export default defineEventHandler(async (event) => {
  const configuration = replicants.configuration;
  const { awayTeam, homeTeam, type, sport } = configuration;
  if (!awayTeam && !homeTeam) {
    return
  };
  let awayPlayers = awayTeam.athletics;
  let homePlayers = homeTeam.athletics;

  let suffix = "";

  switch (sport) {
    case "hockey":
      suffix = type === 'men'
        ? "/sports/mens-ice-hockey/roster"
        : "/sports/womens-ice-hockey/roster";
      break;
    case "football":
      suffix = "/sports/football/roster";
      break;
    case "lacrosse":
      suffix = type === 'men'
        ? "/sports/mens-lacrosse/roster"
        : "/sports/womens-lacrosse/roster";
      break;
    case "acha":
      suffix = "";
      break;
    case "soccer":
      suffix = type === 'men'
        ? "/sports/mens-soccer/roster"
        : "/sports/womens-soccer/roster";
      break;
    case "basketball":
      suffix = type === 'men'
        ? "/sports/mens-basketball/roster"
        : "/sports/womens-basketball/roster";
      break;
    default:
      suffix = "";
      break;
  }

  awayPlayers += suffix;
  homePlayers += suffix;
  return {
    awayPlayers: await fetch(awayPlayers)
      .then(async (response) => await response.text()).catch(() => ""),
    homePlayers: await fetch(homePlayers)
      .then(async (response) => await response.text()).catch(() => ""),
  }
})
