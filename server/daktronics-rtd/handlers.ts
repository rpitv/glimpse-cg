import { replicants } from "~/utils/replicants";
import { announcementTimersTick } from "#imports";

const sync = replicants.configuration.sync;
const scoreboard = replicants.scoreboard;

export function mainClockHandler(value: string): void {
	// logger.trace({value}, 'mainClockHandler called');
	if(!sync.clock) {
		// logger.trace('Clock sync is disabled, ignoring clock update');
		return;
	}

	if(replicants.scoreboard.clock.isRunning) {
		// logger.trace('Clock is manually running but score sync data was received. Stopping manual clock.');
		replicants.scoreboard.clock.isRunning = false;
	}

	// Clock is considered disabled whenever a blank value is sent. Conversely, it is considered enabled whenever a
	//   non-blank value is sent.
	// if(value.length === 0 && replicants.gameSettings.clock.enabled.value) {
	// 	logger.trace('Blank clock value received, disabling the clock.');
	// 	replicants.gameSettings.clock.enabled.value = false;
	// } else if(value.length > 0 && !replicants.gameSettings.clock.enabled.value) {
	// 	logger.trace('Non-blank clock value received, enabling the clock.');
	// 	replicants.gameSettings.clock.enabled.value = true;
	// }

	let mins, secs, tenths, minsAndSecs;
	[minsAndSecs, tenths] = value.split('.');
	if(minsAndSecs.indexOf(':') > -1) {
		[mins, secs] = minsAndSecs.split(':')
	} else {
		secs = minsAndSecs;
		mins = '0';
	}
	// logger.trace({mins, secs, tenths}, 'Parsed string clock values');

	const [minsInt, secsInt, tenthsInt] = [parseInt(mins) || 0, parseInt(secs) || 0, parseInt(tenths) || 0];
	// logger.trace({minsInt, secsInt, tenthsInt}, 'Parsed int clock values');

	replicants.scoreboard.clock.time = minsInt * 60000 + secsInt * 1000 + tenthsInt * 100;
	// logger.trace({time: replicants.scoreboard.clock.time.value}, 'Updated clock time');

	// logger.trace('Running announcement timers tick')
	announcementTimersTick();
}

export function homeScoreHandler(value: string): void {
	if(!sync.homeTeam.score) {
		// logger.trace('Home score sync is disabled, ignoring home score update');
		return;
	}

	scoreboard.homeTeam.score = parseInt(value, 10) || 0;
}

export function awayScoreHandler(value: string): void {
	// logger.trace({value}, 'awayScoreHandler called');

	if(!sync.awayTeam.score) {
		// logger.trace('Away score sync is disabled, ignoring away score update');
		return;
	}

	scoreboard.awayTeam.score = parseInt(value, 10) || 0;
}

export function periodHandler(value: string): void {
	// logger.trace({value}, 'periodHandler called');

	if(!sync.period) {
		// logger.trace('Period sync is disabled, ignoring period update');
		return;
	}

	// Periods are considered disabled whenever a blank value is sent. Conversely, they are considered enabled whenever
	//   a non-blank value is sent.
	// if(value.length === 0 && replicants.gameSettings.periods.enabled.value) {
	// 	logger.trace('Blank period value received, disabling periods.');
	// 	replicants.gameSettings.periods.enabled.value = false;
	// } else if(value.length > 0 && !replicants.gameSettings.periods.enabled.value) {
	// 	logger.trace('Non-blank period value received, enabling periods.');
	// 	replicants.gameSettings.periods.enabled.value = true;
	// }

	scoreboard.period.count = parseInt(value, 10) || 1;
}

// For Hockey
export function homeShotHandler(value: string): void {
	if(!sync.homeTeam.hockey.sog) {
		// logger.trace('Home shots on goal sync is disabled, ignoring home shots on goal update');
		return;
	}

	scoreboard.hockey.homeTeam.sog = parseInt(value, 10) || 0;
}

export function awayShotHandler(value: string): void {
	if(!sync.awayTeam.hockey.sog) {
		// logger.trace('Away shots on goal sync is disabled, ignoring away shots on goal update');
		return;
	}

  scoreboard.hockey.awayTeam.sog = parseInt(value, 10) || 0;
}

export function homePenalty1Handler(value: string): void {
  if (!sync.homeTeam.hockey.penalty) return;

	const data = value.split(" ");
	scoreboard.hockey.homeTeam.penalty.player1.number = data[0] || "";
	scoreboard.hockey.homeTeam.penalty.player1.timer = data[1] || "";
}
export function homePenalty2Handler(value: string): void {
  if (!sync.homeTeam.hockey.penalty) return;

	const data = value.split(" ");
	scoreboard.hockey.homeTeam.penalty.player2.number = data[0] || "";
	scoreboard.hockey.homeTeam.penalty.player2.timer = data[1] || "";
}
export function awayPenalty1Handler(value: string): void {
  if (!sync.awayTeam.hockey.penalty) return;

	const data = value.split(" ");
	scoreboard.hockey.awayTeam.penalty.player1.number = data[0] || "";
	scoreboard.hockey.awayTeam.penalty.player1.timer = data[1] || "";
}
export function awayPenalty2Handler(value: string): void {
  if (!sync.awayTeam.hockey.penalty) return;

	const data = value.split(" ");
	scoreboard.hockey.awayTeam.penalty.player2.number = data[0] || "";
	scoreboard.hockey.awayTeam.penalty.player2.timer = data[1] || "";
}

export function timeoutsHandler(value: string): void {
  // if (sync.homeTeam.football.timeouts)
	//   replicants.teams[0].timeouts.value = parseInt(value.split(" ")[0]);
  // if (sync.awayTeam.football.timeouts)
	//   replicants.teams[1].timeouts.value = parseInt(value.split(" ")[4]);
}

export function playClockHandler(value: string): void {
	if (!sync.football.playClock) {
		// logger.trace('Play clock sync is disabled, ignoring play clock updates');
		return;
	}

  if (scoreboard.football.playClockRunning)
    scoreboard.football.playClockRunning = false;
  
	scoreboard.football.playClock = parseInt(value);
}

export function possessionHandler(value: string): void {
	if (!sync.football.possession) {
		// logger.trace('Possession sync is disabled, ignoring possession updates');
		return;
	}

	scoreboard.football.possession = value.split("")[0];
}

export function downHandler(value: string): void {
	if (!sync.football.downs) {
		// logger.trace('Down sync is disabled, ignoring down updates');
		return;
	}

	scoreboard.football.down = parseInt(value);
}

export function yardsToGoHandler(value: string): void {
	if (!sync.football.yardsToGo) {
		// logger.trace('Yards to go sync is disabled, ignoring yards to go updates');
		return;
	}

	scoreboard.football.yardsToGo = value;
}