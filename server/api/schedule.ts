import { replicants } from '~/utils/replicants';
import { JSDOM } from 'jsdom';
import { getQuery } from 'h3';
import { fetchTextViaCache } from '~/utils/fetching';

export interface ScheduledGame {
  date: Date;
  opponent: string;
  opponentLogo: string;
  opponentLogoAlt: string;
  location: string;
  homeGame: boolean;
  neutralSite: boolean;
}

export interface ScheduleResults {
  lastUpdated: string;
  games: ScheduledGame[];
}

/**
 * Returns a {@link Date} of the game.
 * @param date From the schedule page in the format `Oct 3 (Fri)
 * @param seasonYear Currently selected season from the season selection dropdown menu, format `2025-2026` or `2025`
 * @param time Whatever the time that's displayed on the page, this one is less picky since {@link Date} can resolve many varriations.
 */
function calculateGameDate(date: string, seasonYear: string | number, time: string) {
  // Extract the weekday displayed on the schedule page.
  // 1. Sidearm format: "Oct 3 (Fri)" → take text inside parentheses: "Fri"
  // 2. ACHA format: "Fri, Oct 3" or "Oct 3, Fri" → take the first comma-separated part: "Fri"
  const targetDateWeekday
    // Sidearm format (extract between parentheses)
    = date?.substring(date.indexOf('(') + 1, date.lastIndexOf(')'))
    // ACHA format (contains a comma → take first part before comma)
      || (date.includes(',') ? date.split(', ')[0] : undefined);

  let fullGameDate = new Date(`${date} ${seasonYear} ${time}`);
  // the day of week generated doesn't match expected so it must be the next year in the season i.e. Jan date in a winter sport
  if (targetDateWeekday && fullGameDate.toLocaleDateString('en-us', { weekday: 'short' }) !== targetDateWeekday) {
    fullGameDate = new Date(`${date.substring(0, date.indexOf('(')) || date.substring(date.indexOf(','), date.length)}, ${(Number(seasonYear) || 2000) + 1} ${time}`);
  }
  return fullGameDate;
}

function opponentLogoSanitizer(link: string | undefined, forceFetch: boolean) {
  if (!link) {
    return '';
  }
  if (link.startsWith('https://images.sidearmdev.com/crop?url')) {
    const res = new URL(link).searchParams.get('url');
    return res ? `/api/img?force=${forceFetch}&src=` + encodeURIComponent(res) : '';
  }
  if (link.startsWith('/images')) {
    return `/api/img?force=${forceFetch}&src=` + encodeURIComponent('https://rpiathletics.com' + link);
  }
  return '';
}

function parseNextgenSite(document: Document, forceFetch: boolean) {
  const games: ScheduledGame[] = [];

  const seasonYear = document?.querySelector('#schedule-season-select div.s-select__selected-option')?.textContent || 2000;
  const gameElements = document.querySelectorAll('.s-game-card');
  for (let i = 0; i < gameElements.length; i++) {
    if (!gameElements[i])
      continue;

    const date = gameElements[i]?.querySelector('[data-test-id=\'s-game-card-standard__header-game-date-details\']')?.textContent?.trim() || '';
    const time = gameElements[i]?.querySelector('[aria-label=\'Event Time\']')?.textContent?.trim() || '';
    const opponent = gameElements[i]?.querySelector('[data-test-id=\'s-game-card-standard__header-team-opponent-link\']')?.textContent?.trim() || 'Unknown Opponent';
    const opponentLogo = opponentLogoSanitizer(gameElements[i]?.querySelector('[data-test-id=\'s-game-card-opponent-logo__link\'] img')?.src, forceFetch);

    const opponentLogoAlt = gameElements[i]?.querySelector('[data-test-id=\'s-game-card-opponent-logo__link\'] img')?.alt || '';
    const location = [
      gameElements[i]?.querySelector('[data-test-id=\'s-game-card-facility-and-location__standard-location-details\']')?.textContent?.trim() || '',
      gameElements[i]?.querySelector('[data-test-id=\'s-game-card-facility-and-location__game-facility-title-link\']')?.textContent?.trim() || '',
    ].filter((e) => {
      return 0 < e.length;
    }).join(' | ');
    const homeGame = gameElements[i]?.querySelector('[data-test-id=\'s-stamp__root\']')?.textContent === 'vs' || false;
    const neutralSite = false;
    const fullGameDate = calculateGameDate(date, seasonYear, time);

    games.push({
      date: fullGameDate,
      opponent,
      opponentLogo,
      opponentLogoAlt,
      location,
      homeGame,
      neutralSite,
    });
  }

  return games;
}

function parseSidearmSite(document: Document, forceFetch: boolean) {
  const games: ScheduledGame[] = [];

  const seasonYear = document.querySelector('#sidearm-schedule-select-season [data-current=\'1\']')?.textContent?.trim()?.split('-')[0] || 2000;
  const gameElements = document.querySelectorAll('.sidearm-schedule-games-container > .sidearm-schedule-game');
  for (let i = 0; i < gameElements.length; i++) {
    if (!gameElements[i])
      continue;

    const date = gameElements[i]?.querySelector('.sidearm-schedule-game-opponent-date span')?.textContent?.trim() || '';
    const time = gameElements[i]?.querySelector('.sidearm-schedule-game-opponent-date span:last-child')?.textContent?.trim() || '';
    const opponent = gameElements[i]?.querySelector('.sidearm-schedule-game-opponent-name')?.textContent?.trim() || 'Unknown Opponent';
    const opponentLogo = opponentLogoSanitizer(gameElements[i]?.querySelector('.sidearm-schedule-game-opponent-logo img')?.getAttribute('data-src')?.split('?')[0], forceFetch);
    const opponentLogoAlt = gameElements[i]?.querySelector('.sidearm-schedule-game-opponent-logo img')?.alt || '';
    const location = gameElements[i]?.querySelector('.sidearm-schedule-game-location')?.textContent?.trim()?.replace(/\s{2,}/g, ' | ') || '';
    const homeGame = gameElements[i]?.classList?.contains('sidearm-schedule-home-game');
    const neutralSite = gameElements[i]?.classList?.contains('sidearm-schedule-neutral-game');
    const fullGameDate = calculateGameDate(date, seasonYear, time);
    const game: ScheduledGame = {
      date: fullGameDate,
      opponent,
      opponentLogo,
      opponentLogoAlt,
      location,
      homeGame,
      neutralSite,
    };
    games.push(game);
  }

  return games;
}

function parseAchaSite(document: Document, forceFetch: boolean) {
  const games: ScheduledGame[] = [];

  const seasonYear = document.querySelector('h1.p-4')?.textContent?.trim()?.split('-')[0] || 2000;
  const gameElements = document.querySelector('table')?.querySelectorAll('tbody tr') || [];
  for (let i = 0; i < gameElements.length; i++) {
    if (!gameElements[i])
      continue;

    const date = gameElements[i]?.querySelector('.date i')?.textContent?.trim() || '';
    const time = gameElements[i]?.querySelector('[aria-colindex="3"]')?.textContent?.trim().match(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(am|pm)$/i)?.[0] || '';
    const opponent = gameElements[i]?.querySelector('h3')?.textContent?.trim() || 'Unknown Opponent';
    const opponentLogo
      = `/api/img?force=${forceFetch}&src=`
        + gameElements[i]?.querySelector('img')?.src // todo unconform url better
        || '';
    const opponentLogoAlt = '';
    const location = gameElements[i]?.querySelector('.date a')?.textContent?.trim() || '';
    const homeGame = opponent?.toLowerCase()?.startsWith('vs ') || false;
    const neutralSite = false;
    const fullGameDate = calculateGameDate(date, seasonYear, time);

    games.push({
      date: fullGameDate,
      opponent,
      opponentLogo,
      opponentLogoAlt,
      location,
      homeGame,
      neutralSite,
    });
  }

  return games;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const qForceFetch = query.force || false;
  const forceFetch = qForceFetch !== undefined && qForceFetch !== null && ('true' === qForceFetch || '1' === qForceFetch);

  const configuration = replicants.configuration;
  let athleticsURL = 'https://rpiathletics.com/sports';
  switch (configuration.sport) {
    case 'hockey':
      if (configuration.type === 'men')
        athleticsURL += '/mens-ice-hockey/schedule';
      else if (configuration.type === 'women')
        athleticsURL += '/womens-ice-hockey/schedule';
      break;
    case 'football':
      athleticsURL += '/football/schedule';
      break;
    case 'lacrosse':
      if (configuration.type === 'men')
        athleticsURL += '/mens-lacrosse/schedule';
      else if (configuration.type === 'women')
        athleticsURL += '/womens-lacrosse/schedule';
      break;
    case 'acha':
      athleticsURL = 'https://rpiacha.com/schedule/';
      break;
    case 'soccer':
      if (configuration.type === 'men')
        athleticsURL += '/mens-soccer/schedule';
      else if (configuration.type === 'women')
        athleticsURL += '/womens-soccer/schedule';
      break;
    case 'basketball':
      if (configuration.type === 'men')
        athleticsURL += '/mens-basketball/schedule';
      else if (configuration.type === 'women')
        athleticsURL += '/womens-basketball/schedule';
      break;
    default:
      break;
  }

  const parsesSchedulePage = (data: string, forceFetch: boolean) => {
    const results: ScheduleResults = {
      lastUpdated: new Date().toString(),
      games: [],
    };
    const document = new JSDOM(data).window.document;
    if (configuration.sport === 'acha') {
      results.games = [...parseAchaSite(document, forceFetch)];
    }
    else {
      // sidearm stats
      const gamesA = parseSidearmSite(document, forceFetch);
      const gamesB = parseNextgenSite(document, forceFetch);
      results.games = [...gamesA, ...gamesB];
    }
    return JSON.stringify(results);
  };

  const resultingSchedule = await fetchTextViaCache(athleticsURL, {}, async (res) => {
    const data = await res.text();
    return parsesSchedulePage(data, forceFetch);
  }, 8 * 60 * 60, forceFetch);

  return JSON.parse(resultingSchedule);
});
