import { resetScoreboard } from "#imports"

export default defineEventHandler(async (event) => {
  resetScoreboard();
});