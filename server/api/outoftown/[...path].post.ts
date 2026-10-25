import { replicants } from '~/utils/replicants';
import { fetchSuccess, fetchError } from '~/utils/fetchResponse';
import { defaultOutOfTownTeams } from '~/types/replicants';
import { millisToString } from "~/utils/milisToString";
  
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { params } = event.context;
  const outOfTown= replicants.fullscreen.outOfTown;
  outOfTown.loading = true;

  try {
    if (params!.path === 'add') {
      const linkBody = await fetch(body.link).then((res) => res.json());
      outOfTown.teams.push(body.link, linkBody);
      
    } else if (params!.path === 'default') {
      const type = body.type === 'men' ? 'm' : 'w';
      const outOfTownTeams = defaultOutOfTownTeams(type);
      for (const team of outOfTownTeams)
        team.body = await fetch(team.sidearmsLink).then((res) => res.json());
      outOfTown.teams = outOfTownTeams;

    } else if (params!.path === 'refresh') {
      for (const team of outOfTown.teams)
        team.body = await fetch(team.sidearmsLink).then((res) => res.json());

    } else if (params!.path === 'refreshOne') {
      const linkBody = await fetch(outOfTown.teams[body.index]!.sidearmsLink).then((res) => res.json());
      outOfTown.teams[body.index]!.body = linkBody;
      
    }
  } catch (e) {
    outOfTown.loading = false;
    return fetchError(e);
  }

  function removeTeamRanking(name: string) { 
    return name.replace(/^#\d+(?:\/\d+)*\s*/, '');
  }

  for (const team of outOfTown.teams) {
    team.details.clock = (() => {
      if (team.body.Game.IsComplete)
        return 'Final';
      return millisToString(team.body.Game.ClockSeconds * 1000, false);
    })();
    team.details.visitingTeam = removeTeamRanking(team.body.Game.VisitingTeam?.Name);
    team.details.homeTeam = removeTeamRanking(team.body.Game.HomeTeam?.Name);
    team.details.date = team.body.Game.Date;
    team.details.score = `${team.body.Game.HomeTeam?.Score} - ${team.body.Game.VisitingTeam?.Score}`;
    team.details.period = team.body.Game.Period;
    team.details.periodsRegulation = team.body.Game.PeriodsRegulation;
    team.details.homeLogo = team.body.Game.HomeTeam?.Logo;
    team.details.homeColor = team.body.Game.HomeTeam?.Color || '';
    team.details.homeTextColor = team.body.Game.HomeTeam?.TextColor || '';
    team.details.visitingLogo = team.body.Game.VisitingTeam?.Logo;
    team.details.visitingColor = team.body.Game.VisitingTeam?.Color || '';
    team.details.visitingTextColor = team.body.Game.VisitingTeam?.TextColor || '';
    team.show = new Date().toLocaleDateString("en-us") === team.details.date;
  }

  outOfTown.teams = outOfTown.teams.sort((a, b) => {
    if (a.show && !b.show) return -1;
    if (!a.show && b.show) return 1;
    return 0;
  });

  outOfTown.lastUpdated = new Date().toLocaleString();
  outOfTown.loading = false;
  return fetchSuccess();
})
