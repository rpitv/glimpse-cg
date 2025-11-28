import { replicants } from '~/utils/replicants';
import puppeteer from 'puppeteer';
import type { Browser } from 'puppeteer';

let browser: Browser | null = null;

(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
})();

async function getBrowser() {
  // Wait for browser to be ready
  while (!browser) {
    await new Promise(res => setTimeout(res, 100));
  }
  return browser;
}

export default defineEventHandler(async (event) => {
  const configuration = replicants.configuration;
  const { awayTeam, homeTeam, type, sport } = configuration;
  if (!awayTeam && !homeTeam) {
    return;
  };
  let awayPlayers = awayTeam.athletics;
  let homePlayers = homeTeam.athletics;

  let suffix = '';

  switch (sport) {
    case 'hockey':
      suffix = type === 'men'
        ? '/sports/mens-ice-hockey/roster'
        : '/sports/womens-ice-hockey/roster';
      break;
    case 'football':
      suffix = '/sports/football/roster';
      break;
    case 'lacrosse':
      suffix = type === 'men'
        ? '/sports/mens-lacrosse/roster'
        : '/sports/womens-lacrosse/roster';
      break;
    case 'acha':
      suffix = '';
      break;
    case 'soccer':
      suffix = type === 'men'
        ? '/sports/mens-soccer/roster'
        : '/sports/womens-soccer/roster';
      break;
    case 'basketball':
      suffix = type === 'men'
        ? '/sports/mens-basketball/roster'
        : '/sports/womens-basketball/roster';
      break;
    default:
      suffix = '';
      break;
  }

  awayPlayers += suffix;
  homePlayers += suffix;

  const { html: awayHTML, new: awayNew } = await checkForButton(awayPlayers);
  const { html: homeHTML, new: homeNew } = await checkForButton(homePlayers);

  return {
    awayPlayers: {
      html: awayHTML,
      new: awayNew,
    },
    homePlayers: {
      html: homeHTML,
      new: homeNew,
    },
  };
});

const cache: Record<string, { html: string; new: boolean; timestamp: number }> = {};

async function checkForButton(url: string) {
  const now = Date.now();
  if (cache[url] && now - cache[url].timestamp < 12 * 60 * 60 * 1000) {
    return cache[url];
  }
  const browserInstance = await getBrowser();
  const page = await browserInstance.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  const button = await page.$('#_viewType_card');

  if (button) {
    await button.click();
  }
  const html = await page.content();
  await page.close();
  cache[url] = { html, new: !!button, timestamp: now };
  return cache[url];
}
