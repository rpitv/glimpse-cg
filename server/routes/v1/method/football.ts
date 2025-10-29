
import { replicants } from "~/utils/replicants";

function setFootballInfo(params: any) {
  const { param1, param2, param3 } = params;
  if (!param1 || !param2 || !param3) {
    return {
      statusCode: 400,
      body: { code: 400, msg: "missing params: /football/clock_info/down/yards_to_go/possession" }
    };
  }
  try {
    const down = parseInt(param1);
    if (isNaN(down)) throw new Error();
    const yards = param2;
    const possession = param3;
    replicants.scoreboard.football.down = down;
    replicants.scoreboard.football.yardsToGo = yards;
    replicants.scoreboard.football.possession = possession;
    return {
      statusCode: 200,
      body: { code: 200, msg: `updated board to DOWN:${down}, Yard: ${yards}, Possession: ${possession}` }
    };
  } catch (e) {
    return { statusCode: 400, body: { code: 400, msg: "error parsing url" } };
  }
}

function setClockChange(params: any) {
  const { param1 } = params;
  if (!param1) {
    return { statusCode: 400, body: { code: 400, msg: "missing params: /football/clock_adj/[up1|down1]" } };
  }
  if (param1 === "up1") {
    replicants.scoreboard.clock.time += 1000;
    return { statusCode: 200, body: { code: 200, msg: "increment clock by 1" } };
  } else if (param1 === "down1") {
    replicants.scoreboard.clock.time -= 1000;
    return { statusCode: 200, body: { code: 200, msg: "decrement clock by 1" } };
  } else {
    return { statusCode: 400, body: { code: 400, msg: "invalid clock_adj param" } };
  }
}

function setScore(params: any) {
  const { param1, param2 } = params;
  if (!param1 || !param2) {
    return { statusCode: 400, body: { code: 400, msg: "missing params: /football/score/[team1|team2]/[int]" } };
  }
  try {
    const team = param1;
    const score = parseInt(param2);
    if (team === "team1") {
      replicants.scoreboard.homeTeam.score += score;
      return { statusCode: 200, body: { code: 200, msg: `increased score of team 1 by ${score}` } };
    } else if (team === "team2") {
      replicants.scoreboard.awayTeam.score += score;
      return { statusCode: 200, body: { code: 200, msg: `increased score of team 2 by ${score}` } };
    } else {
      return { statusCode: 400, body: { code: 400, msg: `unknown team ${team}` } };
    }
  } catch (e) {
    return { statusCode: 400, body: { code: 400, msg: "error parsing url" } };
  }
}

const endpointsFootball = {
  clock_info: setFootballInfo,
  clock_adj: setClockChange,
  score: setScore,
};

// Main Nuxt API handler
export default async function football(event: any, paramsArr: string[]) {
  const [endpoint, ...rest] = paramsArr;
  const params: Record<string, string> = {};
  rest.forEach((val, idx) => params[`param${idx + 1}`] = val);

  if (!endpointsFootball[endpoint as keyof typeof endpointsFootball]) {
    return { statusCode: 400, body: { code: 400, msg: `invalid endpoint in football '${endpoint}'` } };
  }
  return endpointsFootball[endpoint as keyof typeof endpointsFootball](params);
}
