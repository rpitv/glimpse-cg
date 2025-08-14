import type {Configuration} from "~/types/replicants";
import {getReplicant} from "~/utils/replicants";
import {JSDOM} from 'jsdom';
import {getQuery} from "h3";
import {fetchTextViaCache} from "~/utils/fetching";


export interface ScheduledGame {
    date: Date
    opponent: string
    opponentLogo: string
    opponentLogoAlt: string
    location: string
    homeGame: boolean
    neutralSite: boolean
}

export interface ScheduleResults {
    lastUpdated: string
    games: ScheduledGame[]
}

function parsesSchedulePage(data: string, forceFetch: boolean) {
    const results: ScheduleResults = {
        lastUpdated: new Date().toString(),
        games: []
    }
    const document = new JSDOM(data).window.document;
    const seasonYear = document.querySelector("#sidearm-schedule-select-season [data-current='1']")?.textContent?.trim()?.split("-")[0] || 2000;
    const gameElements = document.querySelectorAll(".sidearm-schedule-games-container > .sidearm-schedule-game");
    for (let i = 0; i < gameElements.length; i++) {
        if (!gameElements[i])
            continue

        const date = gameElements[i]?.querySelector(".sidearm-schedule-game-opponent-date span")?.textContent?.trim() || "";
        const time = gameElements[i]?.querySelector(".sidearm-schedule-game-opponent-date span:last-child")?.textContent?.trim() || "";
        const opponent = gameElements[i]?.querySelector(".sidearm-schedule-game-opponent-name")?.textContent?.trim() || "Unknown Opponent";
        const opponentLogo =
            `/api/img?force=${forceFetch}&src=https://rpiathletics.com` +
            gameElements[i]?.querySelector(".sidearm-schedule-game-opponent-logo img")?.getAttribute('data-src')?.split("?")[0]
            || "";
        const opponentLogoAlt = gameElements[i]?.querySelector(".sidearm-schedule-game-opponent-logo img")?.alt || "";
        const location = gameElements[i]?.querySelector(".sidearm-schedule-game-location")?.textContent?.trim()?.replace(/\s{2,}/g, " | ") || "";
        const homeGame = gameElements[i]?.classList?.contains("sidearm-schedule-home-game");
        const neutralSite = gameElements[i]?.classList?.contains("sidearm-schedule-neutral-game");

        const targetDateWeekday = date?.substring(date?.indexOf("(") + 1, date?.lastIndexOf(")")) || undefined;
        let fullGameDate = new Date(`${date} ${seasonYear} ${time}`);
        if (targetDateWeekday && fullGameDate.toLocaleDateString("en-us", {weekday: 'short'}) !== targetDateWeekday) {
            fullGameDate = new Date(`${date.substring(0, date.indexOf("("))}, ${(Number(seasonYear) || 2000) + 1} ${time}`);
        }

        const game: ScheduledGame = {
            date: fullGameDate,
            opponent,
            opponentLogo,
            opponentLogoAlt,
            location,
            homeGame,
            neutralSite,
        }
        results.games.push(game);
    }
    return JSON.stringify(results);
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const qForceFetch = query.force || false;
    const forceFetch = qForceFetch !== undefined && qForceFetch !== null && ("true" === qForceFetch || "1" === qForceFetch);

    const configuration = getReplicant<Configuration>("configuration");
    let athleticsURL = "https://rpiathletics.com/sports"
    switch (configuration?.value.sport) {
        case "hockey":
            if (configuration.value.type === 'men')
                athleticsURL += "/mens-ice-hockey/schedule";
            else if (configuration.value.type === 'women')
                athleticsURL += "/womens-ice-hockey/schedule";
            break;
        case "football":
            athleticsURL += "/football/schedule";
            break;
        case "lacrosse":
            if (configuration.value.type === 'men')
                athleticsURL += "/mens-lacrosse/schedule";
            else if (configuration.value.type === 'women')
                athleticsURL += "/womens-lacrosse/schedule";
            break;
        case "acha":
            athleticsURL = "https://rpiacha.com/schedule/"
            break;
        case "soccer":
            if (configuration.value.type === 'men')
                athleticsURL += "/mens-soccer/schedule";
            else if (configuration.value.type === 'women')
                athleticsURL += "/womens-soccer/schedule";
            break;
        case "basketball":
            if (configuration.value.type === 'men')
                athleticsURL += "/mens-basketball/schedule";
            else if (configuration.value.type === 'women')
                athleticsURL += "/womens-basketball/schedule";
            break;
        default:
            break;
    }

    const resultingSchedule = await fetchTextViaCache(athleticsURL, {}, async (res) => {
        const data = await res.text();
        return parsesSchedulePage(data, forceFetch);
    }, 8 * 60 * 60, forceFetch);

    return JSON.parse(resultingSchedule);
});
