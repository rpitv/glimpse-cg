import { Configuration } from "~/types/replicants";
import { getReplicant } from "~/utils/replicants";

export default defineEventHandler(async (event) => {
  const { channel } = getQuery(event) as { channel: string };
  const configuration = getReplicant<Configuration>(channel, "configuration");
  let mensAthleticsURL = "https://rpiathletics.com/sports"
  let womensAthleticsURL = "https://rpiathletics.com/sports";
  switch (configuration?.value.sport) {
    case "hockey":
      mensAthleticsURL += "/mens-ice-hockey/schedule";
      womensAthleticsURL += "/womens-ice-hockey/schedule";
      break;
    case "football":
      mensAthleticsURL += "/football/schedule";
      womensAthleticsURL = "";
      break;
    case "lacrosse":
      mensAthleticsURL += "/mens-lacrosse/schedule";
      womensAthleticsURL += "/womens-lacrosse/schedule";
      break;
    case "acha":
      mensAthleticsURL = "https://rpiacha.com/schedule/";
      womensAthleticsURL = "";
      break;
    case "soccer":
      mensAthleticsURL += "/mens-soccer/schedule";
      womensAthleticsURL += "/womens-soccer/schedule";
      break;
    case "basketball":
      mensAthleticsURL += "/mens-basketball/schedule";
      womensAthleticsURL += "/womens-basketball/schedule";
      break;
    default:
      break;
  }
  return { 
    mens: await fetch(`${mensAthleticsURL}?grid=true`)
      .then(async (response) => await response.text()),
    womens: womensAthleticsURL ? await fetch(`${womensAthleticsURL}?grid=true`)
      .then(async (response) => await response.text()) : null,
    mensLogo: await fetch(`${mensAthleticsURL}`)
      .then(async (response) => await response.text()),
    womensLogo: womensAthleticsURL ? await fetch(`${womensAthleticsURL}`)
      .then(async (response) => await response.text()) : null
  }
});
