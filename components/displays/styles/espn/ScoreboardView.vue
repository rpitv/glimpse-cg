<template>
	<div :class="'center'">
		<div class="scoreboard bordered">
			<div>
				<TeamView team="awayTeam" />
				<div v-if="powerplaySync.type === 'away'" class="announcement-section awayTeam">
					<p>
						{{ powerplaySync.status }} {{ powerPlayClock }}
					</p>
				</div>
				<div v-if="scoreboard!.awayTeam.announcement.length > 0" class="announcement-section awayTeam">
					<p>
						{{ computedMessage(scoreboard!.awayTeam.announcement[0]).value }}
					</p>
				</div>
				<div v-if="channel![channelIndex].shootout" class="announcement-section awayTeam">
					<p>
            <span v-for="shot of hockeyAwayTeam.score">
              {{ shot ? '✅' : '❌' }}
            </span>
					</p>
				</div>
			</div>
			<div class="bordered">
				<TeamView team="homeTeam" />
				<div v-if="powerplaySync.type === 'home'" class="announcement-section homeTeam">
					<p>
            {{ powerplaySync.status }} {{ powerPlayClock }}
					</p>
				</div>
				<div v-if="scoreboard!.homeTeam.announcement.length > 0" class="announcement-section homeTeam">
					<p>
						{{ computedMessage(scoreboard!.homeTeam.announcement[0]).value  }}
					</p>
				</div>
				<div v-if="channel![channelIndex].shootout" class="announcement-section homeTeam">
					<p>
					<p>
            <span v-for="shot of hockeyHomeTeam.score">
              {{ shot ? '✅' : '❌' }}
            </span>
					</p>
					</p>
				</div>
			</div>

			<div class="time-section bordered">
				<p class="period-section">
					{{ formattedPeriod }}
				</p>
				<hr>
				<div class="clock-section">
					<p>
						{{ formattedClockTime }}
					</p>
				</div>
				<div v-if="powerplaySync.type === 'global'" class="announcement-section global">
					<p>
						{{ powerplaySync.status }} {{ powerPlayClock }}

					</p>
				</div>
				<div v-if="scoreboard!.announcement.length > 0" class="announcement-section global">
					<p>
						{{ computedMessage(scoreboard!.announcement[0]).value }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Channels, Configuration, Scoreboard } from "~/types/replicants";
import TeamView from "./TeamView.vue";
import { Announcement } from "~/utils/announcement";

const route = useRoute();
let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);
const channel = useReplicant<Channels>("channels");
const scoreboard = useReplicant<Scoreboard>("scoreboard");
const configuration = useReplicant<Configuration>("configuration")
const hockeyAwayTeam = computed(() => scoreboard.value!.hockey.awayTeam);
const hockeyHomeTeam = computed(() => scoreboard.value!.hockey.homeTeam);
const awayTeam = computed(() => configuration.value!.awayTeam);
const homeTeam = computed(() => configuration.value!.homeTeam);
const awayTeamColor = computed(() => awayTeam.value.primaryColor);
const homeTeamColor = computed(() => homeTeam.value.primaryColor);
const clock = computed(() => scoreboard.value!.clock);
const period = computed(() => scoreboard.value!.period);

const formattedClockTime = computed<string>(() => {
	const minutes = Math.floor(clock.value.time / 60000).toString();
	let seconds = Math.floor((clock.value.time % 60000) / 1000).toString();
	const millis = Math.floor((clock.value.time % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
})

const formattedPeriod = computed<string>(() => {
	if(period.value.count > period.value.length) {
		const overtimePeriod = period.value.count - period.value.length;
		if (period.value.count > period.value.overtime.length + period.value.length)
			return 'S/O';
		if(overtimePeriod === 1) {
			return 'OT';
		} else {
			return `OT${overtimePeriod}`;
		}
	}

	if(period.value.count === undefined) {
		return '1st';
	}

	// Teens for some reason all end in "th" in English.
	if(period.value.count > 10 && period.value.count < 20) {
		return period.value + 'th';
	}

	// For all other numbers up to 99, we need to figure out the suffix.
	const lastNumberOfPeriod = period.value.count % 10;
	if(lastNumberOfPeriod === 1) {
		return `${period.value}st`;
	} else if(lastNumberOfPeriod === 2) {
		return `${period.value}nd`;
	} else if(lastNumberOfPeriod === 3) {
		return `${period.value}rd`;
	} else {
		return `${period.value}th`;
	}
});

/*
Used to calculate whether white or black text should appear on announcements
Source: https://stackoverflow.com/a/41491220/4698546
 */
function pickTextColorBasedOnBgColorSimple(bgColor: string, lightColor: string, darkColor: string) {
	const color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
	const r = parseInt(color.substring(0, 2), 16); // hexToR
	const g = parseInt(color.substring(2, 4), 16); // hexToG
	const b = parseInt(color.substring(4, 6), 16); // hexToB
	return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
		darkColor : lightColor;
}

const homeTeamTextColor = computed(() => pickTextColorBasedOnBgColorSimple(homeTeam.value.primaryColor, '#ffffff', '#000000'))
const awayTeamTextColor = computed(() => pickTextColorBasedOnBgColorSimple(awayTeam.value.primaryColor, '#ffffff', '#000000'))


function computedMessage(message: Announcement) {
	return computed(() => {
		if(!message.timer || !message.timer.visible) {
			return message.message;
		} else {
			const timeRemaining = message.timer.length - (message.timer.startedAt - scoreboard.value!.clock.time);

			const minutes = Math.max(0, Math.floor(timeRemaining / 60000)).toString();
			// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
			let seconds = Math.max(0, Math.floor((timeRemaining % 60000) / 1000)).toString().padStart(2, '0');

			if(minutes === '0') {
				return message.message + ' :' + seconds
			} else {
				return message.message + ' ' + minutes + ':' + seconds
			}
		}
	})
}

// POWERPLAY SYNC
const powerplaySync = computed(() => {
	// If two away players are on penalty...
  let powerplay = {
    status: "",
    type: "",
  }
	if (hockeyAwayTeam.value.penalty.player1.number && hockeyAwayTeam.value.penalty.player2.number) {
		// If two home players are on penalty
		if (hockeyHomeTeam.value.penalty.player1.number) {
      if (hockeyHomeTeam.value.penalty.player2.number) {
        powerplay.type = "global";
        powerplay.status = "3 on 3";
      } else {
        powerplay.type = "home";
        powerplay.status = "4 on 3";
      }
    } else {
      powerplay.type = "home";
      powerplay.status = "5 on 3";
    }
	}
	// If two home players are on penalty...
	else if (hockeyHomeTeam.value.penalty.player1.number && hockeyHomeTeam.value.penalty.player2.number) {
		// If two away players are on penalty
    if (hockeyAwayTeam.value.penalty.player1.number) {
      if (hockeyAwayTeam.value.penalty.player2.number) {
        powerplay.type = "global";
        powerplay.status = "3 on 3";
      } else {
        powerplay.type = "away";
        powerplay.status = "4 on 3";
      }
    } else {
      powerplay.type = "away";
      powerplay.status = "5 on 3";
    }
	}
	// If either away player is on a penalty...
	else if (hockeyAwayTeam.value.penalty.player1.number || hockeyAwayTeam.value.penalty.player2.number) {
		// If either home player is on a penalty...
		if (hockeyHomeTeam.value.penalty.player1.number || hockeyHomeTeam.value.penalty.player2.number) {
       powerplay.type = "global";
       powerplay.status = "4 on 4";
    } else {
      powerplay.type = "home";
      powerplay.status = "Power Play";
    }
	}
	// If either home player is on a penalty...
	else if (hockeyHomeTeam.value.penalty.player1.number || hockeyHomeTeam.value.penalty.player2.number) {
    // If either away player is on a penalty...
    if (hockeyAwayTeam.value.penalty.player1.number || hockeyAwayTeam.value.penalty.player2.number) {
      powerplay.type = "global";
      powerplay.status = "4 on 4";
    } else {
      powerplay.type = "away";
      powerplay.status = "Power Play";
    }
  }
	return powerplay;
});

const powerPlayClock = computed(() => {
	let smallestTime = "";
	const times = [hockeyHomeTeam.value.penalty.player1.timer, hockeyHomeTeam.value.penalty.player2.timer,
    hockeyAwayTeam.value.penalty.player1.timer, hockeyAwayTeam.value.penalty.player2.timer];

	for (const time of times) {
		if (!time)
			continue;
		if (!smallestTime) {
			smallestTime = time;
			continue;
		}
		// If the minutes of the "smallest time" is less than the minute of the time, ignore it
		if (smallestTime.split(":")[0] < time.split(":")[0])
			continue;

		// If the minutes of the "smallest time" is equal to the minute of the time...
		if (smallestTime.split(":")[0] == time.split(":")[0]) {
			// If the seconds of the "smallest time" is less than the seconds of the time, ignore it
			if (smallestTime.split(":")[1] < time.split(":")[1] && smallestTime.split(":")[1] != "0")
				continue;
			smallestTime = time;
			continue;
		}
		smallestTime = time;
	}
	return smallestTime;
})

</script>

<style scoped lang="scss">
div {
	--scoreboard-height: 4.5vh;
}

.center {
	display: flex;
	justify-content: center;
	transition: opacity 1s;
}

.bordered {
	outline: rgb(157,154,136) 0.15vw solid;
}

.scoreboard {
	display: flex;
	justify-content: center;
	position: absolute;
	top: 6.1vh;
	height: var(--scoreboard-height);
	transition: opacity 1s;
}

.time-section {
	display: flex;
	align-items: center;
	font-family: 'Roboto', sans-serif;
	background-color: rgb(220, 220, 220);
	height: var(--scoreboard-height);

	hr {
		height: 50%;
		transform: translateY(50%);
		border: 0;
		border-right: rgb(157,154,136) 0.075vw solid;
	}

	.period-section, .clock-section {
		text-align: center;
	}

	.period-section {
		font-size: 1.5vw;
		width: 4.1vw;
	}
	.clock-section {
		font-size: 1.5vw;
		width: 5.9vw;
	}
}

.announcement-section {
	position: absolute;
	outline: rgb(157,154,136) 0.15vw solid;
	font-family: 'Roboto', sans-serif;
	font-size: 2.4vh;
	height: 4vh;

	&.global {
		background-color: rgb(241,229,76);
		color: rgb(99,87,24);
		width: 10.05vw;
		top: 5.4vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	&.homeTeam {
		display: flex;
		align-items: center;
		text-align: left;
		padding-left: 0.5em;
		background-color: v-bind(homeTeamColor);
		color: v-bind(homeTeamTextColor);
		width: 20.7vw;
		top: 5.4vh;
	}

	&.awayTeam {
		display: flex;
		align-items: center;
		text-align: left;
		padding-left: 0.5em;
		background-color: v-bind(awayTeamColor);
		color: v-bind(awayTeamTextColor);
		top: 5.4vh;
		width: 20.7vw;
	}
}
</style>
