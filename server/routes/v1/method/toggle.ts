import { replicants } from "~/utils/replicants";

const channels = replicants.channels;

// Main Nuxt API handler
export default async function toggle(event: any, paramsArr: string[]) {
  const [endpoint, ...rest] = paramsArr;
  const params: Record<string, string> = {};
  rest.forEach((val, idx) => params[`param${idx + 1}`] = val);
  const { param1 } = params;
  let option = null;
  if (param1 === "true")
    option = true;
  else if (param1 === "false")
    option = false;

  switch(endpoint) {
    case "bug":
      channels[0].bug = option ?? !channels[0].bug;
      break;
    case "commentators":
      channels[0].commentators = option ?? !channels[0].commentators;
      break;
    case "copyright":
      channels[0].copyright = option ?? !channels[0].copyright;
      break;
    case "credits":
      channels[0].credits = option ?? !channels[0].credits;
      break;
    case "showProduced":
      channels[0].produced = option ?? !channels[0].produced;
      break;
    case "lt-locator":
      channels[0].locator = option ?? !channels[0].locator;
      break;
    case "lt-scoreboard":
      channels[0].goToBreak = option ?? !channels[0].goToBreak;
      break;
    case "lt-scoreboard-timer":
      replicants.lowerThird.goToBreak.description.clock = option ?? !replicants.lowerThird.goToBreak.description.clock;
      break;
    case "main-scoreboard":
      channels[0].scoreboard = option ?? !channels[0].scoreboard;
      break;
    case "player-bio":
      channels[0].playerBio = option ?? !channels[0].playerBio;
    case "scorebug":
      channels[0].scoreboard = option ?? !channels[0].scoreboard;
      break;
    case "sogs":
      channels[0].sog = option ?? !channels[0].sog;
      break;
    case "clock":
      replicants.scoreboard.clock.isRunning = option ?? !replicants.scoreboard.clock.isRunning;
      break;
    case "player_bio":
      channels[0].playerBio = option ?? !channels[0].playerBio;
      break;
    case "standings":
      channels[0].standings = option ?? !channels[0].standings;
      break;
    default:
      return { statusCode: 400, body: { code: 400, msg: "invalid endpoint" } };
  }
  return { statusCode: 200, body: { code: 200, msg: `toggled [${endpoint}]` } }
}
