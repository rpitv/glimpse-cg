import { replicants } from "~/utils/replicants";

export default defineEventHandler(async (event) => {
  const configuration = replicants.configuration;
  let athleticsURL = "https://rpiathletics.com/sports"
  switch (configuration?.sport) {
    case "hockey":
      if (configuration.type === 'men')
        athleticsURL += "/mens-ice-hockey/schedule";
      else if (configuration.type === 'women')
        athleticsURL += "/womens-ice-hockey/schedule";
      break;
    case "football":
      athleticsURL += "/football/schedule";
      break;
    case "lacrosse":
      if (configuration.type === 'men')
        athleticsURL += "/mens-lacrosse/schedule";
      else if (configuration.type === 'women')
        athleticsURL += "/womens-lacrosse/schedule";
      break;
    case "acha":
      athleticsURL = "https://rpiacha.com/schedule/"
      break;
    case "soccer":
      if (configuration.type === 'men')
        athleticsURL += "/mens-soccer/schedule";
      else if (configuration.type === 'women')
        athleticsURL += "/womens-soccer/schedule";
      break;
    case "basketball":
      if (configuration.type === 'men')
        athleticsURL += "/mens-basketball/schedule";
      else if (configuration.type === 'women')
        athleticsURL += "/womens-basketball/schedule";
      break;
    default:
      break;
  }
  return { 
    data: await fetch(`${athleticsURL}?grid=true`)
      .then(async (response) => await response.text()),
    logos: await fetch(`${athleticsURL}`)
      .then(async (response) => await response.text()),
  }
});
