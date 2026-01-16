import { replicantEvents } from '~/utils/pathHelpers';
import { replicants } from '~/utils/replicants';


export default defineNitroPlugin((nitroApp) => {
  replicantEvents.on('change', async (path, value) => {
    // If the scoreboard turns off, turn off any element that relies on it..
    if (JSON.stringify(path) === JSON.stringify(["channels", "0", "scoreboard"]) && value === false) {
      if (replicants.configuration.sport === 'hockey') {
        replicants.channels[0]!.shootout = false;
        replicants.channels[0]!.faceoff = false;
        replicants.channels[0]!.sog = false;
      }
    }
  });
});
