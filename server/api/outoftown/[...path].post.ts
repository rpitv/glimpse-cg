import { replicants } from '~/utils/replicants';
import { fetchSuccess, fetchError } from '~/utils/fetchResponse';
import { defaultOutOfTownTeams } from '~/types/replicants';
  
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { params } = event.context;
  const { outOfTown } = replicants.fullscreen;
  outOfTown.loading = true;

  try {
    if (params!.path === 'add') {
      const linkBody = await fetch(body.link).then((res) => res.json());
      outOfTown.teams.push(body.link, linkBody);
      
    } else if (params!.path === 'default') {
      const type = replicants.configuration.type === 'men' ? 'm' : 'w';
      console.log(replicants.configuration.type);
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
  for (const team of outOfTown.teams) {
    const game = team.body;
    team.details = game;
  }

  outOfTown.lastUpdated = new Date();
  outOfTown.loading = false;
  return fetchSuccess();
})
