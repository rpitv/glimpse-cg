
import { replicants } from "~/utils/replicants";

function setScore(params: any, deltaType: "up" | "down" | "set") {
  const { param1, param2 } = params;
  const team = param1;
  if (!team) {
    return { statusCode: 400, body: { code: 400, msg: "missing team to set score for" } };
  }
  let teamReplicant = null;
  if (team === "team1") {
    teamReplicant = replicants.scoreboard.homeTeam;
  } else if (team === "team2") {
    teamReplicant = replicants.scoreboard.awayTeam;
  } else {
    return { statusCode: 400, body: { code: 400, msg: `invalid team: '${team}' (team1 | team2)` } };
  }
  const oldScore = teamReplicant.score;
  const deltaScore = param2;
  if (!deltaScore) {
    return { statusCode: 400, body: { code: 400, msg: "missing score number to change or set" } };
  }
  if (isNaN(Number(deltaScore))) {
    return { statusCode: 400, body: { code: 400, msg: "score must be a valid integer." } };
  }
  if (deltaType === "up") {
    teamReplicant.score = teamReplicant.score + Number(deltaScore);
  } else if (deltaType === "set") {
    teamReplicant.score = Number(deltaScore);
  } else if (deltaType === "down") {
    teamReplicant.score = teamReplicant.score - Number(deltaScore);
  } else {
    return { statusCode: 400, body: { code: 400, msg: `score#setScore(delta: ${deltaType}) illegal state` } };
  }
  return { statusCode: 200, body: { code: 200, msg: `Changed team '${team}' score '${deltaType}' from '${teamReplicant.score}' to '${oldScore}'` } };
}

const endpointsScore = {
  down: (params: any) => setScore(params, "down"),
  up: (params: any) => setScore(params, "up"),
  set: (params: any) => setScore(params, "set"),
};

// Main Nuxt API handler
export default async function score(event: any, paramsArr: string[]) {
  const [endpoint, ...rest] = paramsArr;
  const params: Record<string, string> = {};
  rest.forEach((val, idx) => params[`param${idx + 1}`] = val);

  if (!endpointsScore[endpoint as keyof typeof endpointsScore]) {
    return { statusCode: 400, body: { code: 400, msg: `invalid endpoint in score '${endpoint}'` } };
  }
  return endpointsScore[endpoint as keyof typeof endpointsScore](params);
}
