import { Announcement } from "~/utils/announcement";
import { replicants } from "~/utils/replicants";

const { clock, awayTeam, homeTeam } = replicants.scoreboard
let scoreboardTimer: NodeJS.Timeout | null = null;
let scoreboardTimerLastModified: number | null = null;

export function handler() {
  clockHandler();
}

function clockHandler() {
  if ((clock.isRunning && scoreboardTimer !== null) || (!clock.isRunning && scoreboardTimer === null)) {
    return;
  }

  if (clock.isRunning) {
    scoreboardTimerLastModified = Date.now();
    scoreboardTimer = setInterval(clockTick, 100);
  } else {
    if(scoreboardTimer !== null) {
			clearInterval(scoreboardTimer);
			scoreboardTimer = null;
		}
		scoreboardTimerLastModified = null;
  }
}

function clockTick() {
	// Stop the clock once it hits zero.
	if(clock.time <= 0) {
		clock.isRunning = false;
		return;
	}

	// If clock hasn't hit zero yet, update its value.
	const now = Date.now();
	if(scoreboardTimerLastModified !== null) {
		replicants.scoreboard.clock.time -= now - scoreboardTimerLastModified;
		if(replicants.scoreboard.clock.time < 0) {
			replicants.scoreboard.clock.time = 0;
		}
	}

	announcementTimersTick();

	scoreboardTimerLastModified = now;
}

export function announcementTimersTick() {
	const allAnnouncements = [
		...replicants.scoreboard.announcement,
		...replicants.scoreboard.awayTeam.announcement,
		...replicants.scoreboard.homeTeam.announcement,
	]

	for(const announcement of allAnnouncements) {
		if(!announcement.timer) {
			continue;
		}

		const currentClockTime = clock.time;

		const timeRemaining = announcement.timer.length - (announcement.timer.startedAt - currentClockTime);
		if(timeRemaining <= 0) {
			// if(announcement.timer.timerEndsAction === "removeAnnouncement") {
      removeAnnouncement(announcement);
			// } else if(announcement.timer.timerEndsAction === "removeTimer") {
				// announcement.timer = null;
			// }
		}
	}
}

function removeAnnouncement(announcement: Announcement) {
	if(replicants.scoreboard.announcement.find(a => a.id === announcement.id)) {
		replicants.scoreboard.announcement = replicants.scoreboard.announcement.filter(a => a.id !== announcement.id);
	}
	if(awayTeam.announcement.find(a => a.id === announcement.id)) {
		awayTeam.announcement = awayTeam.announcement.filter(a => a.id !== announcement.id);
	}
	if(homeTeam.announcement.find(a => a.id === announcement.id)) {
		homeTeam.announcement = homeTeam.announcement.filter(a => a.id !== announcement.id);
	}
}