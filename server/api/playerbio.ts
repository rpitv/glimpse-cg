import { replicants } from "~/utils/replicants";
import puppeteer from "puppeteer";

export default defineEventHandler(async (event) => {
  const configuration = replicants.configuration;
  const { awayTeam, homeTeam, type, sport } = configuration;
  if (!awayTeam && !homeTeam) {
    return
  };
  let awayPlayers = awayTeam.athletics;
  let homePlayers = homeTeam.athletics;

  let suffix = "";

  switch (sport) {
    case "hockey":
      suffix = type === 'men'
        ? "/sports/mens-ice-hockey/roster"
        : "/sports/womens-ice-hockey/roster";
      break;
    case "football":
      suffix = "/sports/football/roster";
      break;
    case "lacrosse":
      suffix = type === 'men'
        ? "/sports/mens-lacrosse/roster"
        : "/sports/womens-lacrosse/roster";
      break;
    case "acha":
      suffix = "";
      break;
    case "soccer":
      suffix = type === 'men'
        ? "/sports/mens-soccer/roster"
        : "/sports/womens-soccer/roster";
      break;
    case "basketball":
      suffix = type === 'men'
        ? "/sports/mens-basketball/roster"
        : "/sports/womens-basketball/roster";
      break;
    default:
      suffix = "";
      break;
  }

  awayPlayers += suffix;
  homePlayers += suffix;

  const {html: awayHTML, new: awayNew } = await checkForButton(awayPlayers);
  const {html: homeHTML, new: homeNew} = await checkForButton(homePlayers);

  return {
    awayPlayers: {
      html: awayHTML,
      new: awayNew
    },
    homePlayers: {
      html: homeHTML,
      new: homeNew
    }
  }
});

async function checkForButton(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });
  const button = await page.$('#_viewType_card');

  if (button) {
    await button.click();
  }
  const html = await page.content();
  await browser.close();
  return { html, new: !!button};
}