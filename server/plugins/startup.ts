import { replicants } from "~/utils/replicants"
import { resetScoreboard } from "#imports"

export default defineNitroPlugin((nitroApp) => {
  if (replicants.configuration.startup.resetScoreboard) {
    resetScoreboard();
  }
});