<template>
	<div class="scoreboard">
		<div class="game-info">
			<div class="logo game-info-child">
				<img id="logoImg" :src="rpitvLogo">
			</div>
			<div class="clock game-info-child">
				{{ formattedClockTime }}
			</div>
			<div class="period game-info-child">
				{{ formattedPeriod }}
			</div>
		</div>
		<div class="teams">
			<TeamView team="homeTeam" class="home-team-view" />
			<TeamView team="awayTeam" class="away-team-view" />
		</div>
		<div class="animation">
			<div class="animation-text text1">

			</div>
			<div class="animation-text text2">
				{{ scorer.toUpperCase() }}
			</div>
		</div>
	</div>
	<div class="global-announcements">
		<p v-if="scoreboard!.announcement.length > 0">
			{{ computedMessage(scoreboard!.announcement[0]).value }}
		</p>

		<p v-else-if="powerPlaySync.type === 'global'">
			{{ powerPlaySync.status }} {{ powerPlayClock }}
		</p>
	</div>
	<div class="team-announcements homeTeam">
		<p v-if="scoreboard!.homeTeam.announcement.length > 0">
			{{ computedMessage(scoreboard!.homeTeam.announcement[0]).value}}
		</p>
		<p v-else-if="powerPlaySync.type === 'home'">
			{{ powerPlaySync.status }} {{ powerPlayClock }}
		</p>
		<p v-else-if="channels![channelIndex].shootout">
      <span v-for="shot in hockeyHomeTeam.score">{{ shot ? '✅' : '❌'}}</span>
		</p>
	</div>
	<div class="team-announcements awayTeam">
		<p v-if="scoreboard!.awayTeam.announcement.length > 0">
			{{ computedMessage(scoreboard!.awayTeam.announcement[0]).value}}
		</p>
		<p v-else-if="powerPlaySync.type === 'away'">
		{{ powerPlaySync.status }} {{ powerPlayClock }}
	</p>
		<p v-else-if="channels![channelIndex].shootout">
      <span v-for="shot in hockeyAwayTeam.score">{{ shot ? '✅' : '❌'}}</span>
		</p>
	</div>
</template>

<script setup lang="ts">
import rpitvLogo from "~/assets/football/rpitv_logo.png";
import TeamView from "./TeamView.vue";
import gsap from "gsap";
import { isLightColor, calcLinearGrad, isLighter } from "../../../util";
import { CustomEase } from "gsap/CustomEase";
import type { Announcement } from "~/utils/announcement";

const route = useRoute();
const replicants = await useReplicants();
let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

gsap.registerPlugin(CustomEase);

const scoreboard = replicants.scoreboard;
const configuration = replicants.configuration;
const channels = replicants.channels;
const clock = scoreboard.clock;
const period = scoreboard.period;
const awayTeam = scoreboard.awayTeam;
const homeTeam = scoreboard.homeTeam;

const announcementsPos = ref("21vw");
const awayTeamPos = ref("11.5vh");
const homeTeamPos = ref("11.5vh");
const scoreboardColor = ref("black");
const animationText = ref("");
const scorer = ref("");

let awayTeamOpen = false;
let homeTeamOpen = false;
let globalOpen = false;

// Animation
function showGlobal() {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	t1.to(".global-announcements", {opacity: 1, duration: 1});
	t2.to(announcementsPos, {value: "29vw", duration: 1.5});
}

function hideGlobal() {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	t1.to(".global-announcements", {opacity: 0, duration: 1});
	t2.to(announcementsPos, {value: "21vw", duration: 1.5});
}

function showTeam(teamPos: Ref<string>, element: string) {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	t1.to(teamPos, {value: "15vh", duration: 1});
	t2.to(element, {opacity: 1, duration: 1})
}

function hideTeam(teamPos: Ref<string>, element: string) {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	t1.to(teamPos, {value: "11.5vh", duration: 1});
	t2.to(element, {opacity: 0, duration: 1})
}

function runAnimation(team: "awayTeam" | "homeTeam") {
	scoreboardColor.value = configuration[team].primaryColor;
	animationText.value = isLightColor(scoreboardColor.value) ? "white" : "black";
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	const t3 = gsap.timeline();
	const t4 = gsap.timeline();
	const t5 = gsap.timeline();
	const t6 = gsap.timeline();
	const disappearance = 1.5;
	t1.to(".game-info", {top: "-4vh", duration: disappearance});
	t2.to(".team-view-1", {top: "5vh", left: "-10.5vw", duration: disappearance});
	t3.to(".team-view-2", {top: "5vh", left: "21vw", duration: disappearance});
	t4.fromTo(".text1",{left: "", filter: "", letterSpacing: 0, fontSize: "100vh"}, {fontSize: "8vh", duration: 2});
	t4.to(".text1", {fontSize: "9vh", duration: 0.5});
	t5.to(".text1", {letterSpacing: "1vw", duration: 2}, "+=2");
	t6.to(".text1", {
		innerText: "GOAL"
	})
	t4.to(".text1", {left: "75vw", duration: 1}, "+=1");
	t5.to(".text1", {filter: "blur(5vh)", duration: 1}, "-=0.5");
	scorer.value = configuration[team].shortName;
	t4.fromTo(".text2", {left: "75vw", letterSpacing: 0}, {left: "0vw", duration: 1, ease: "power3.out"}, "-=1.25");
	t1.to(".game-info", {top: "0vh", duration: disappearance}, "+=4");
	t2.to(".team-view-1", {top: "0vh", left: "0vw", duration: disappearance}, "+=4");
	t3.to(".team-view-2", {top: "0vh", left: "12.5vw", duration: disappearance}, "+=4");
}

const awayTeamScore = computed(() => scoreboard.awayTeam.score);
const homeTeamScore = computed(() => scoreboard.homeTeam.score);

watch(awayTeamScore, (n, o) => {
	if (n - o === 1)
		runAnimation("awayTeam");
});

watch(homeTeamScore, (n, o) => {
	if (n - o === 1)
		runAnimation("homeTeam");
});

// Announcements
const awayTeamFontColor = ref("black");
const homeTeamFontColor = ref("black");

const awayTeamColor1 = computed(() => {
	const linearGradient = calcLinearGrad(awayTeam.secondaryColor);
	if (!isLighter(awayTeam.secondaryColor, linearGradient))
		return linearGradient;
	return awayTeam.secondaryColor;
});

const awayTeamColor2 = computed(() => {
	const linearGradient = calcLinearGrad(awayTeam.secondaryColor);
	if (!isLighter(awayTeam.secondaryColor, linearGradient))
		return awayTeam.secondaryColor;
	return linearGradient;
});

const homeTeamColor1 = computed(() => {
	const linearGradient = calcLinearGrad(homeTeam.secondaryColor);
	if (!isLighter(homeTeam.secondaryColor, linearGradient))
		return linearGradient;
	return homeTeam.secondaryColor;
});

const homeTeamColor2 = computed(() => {
	const linearGradient = calcLinearGrad(homeTeam.secondaryColor);
	if (!isLighter(homeTeam.secondaryColor, linearGradient))
		return homeTeam.secondaryColor;
	return linearGradient;
});

if (isLightColor(awayTeamColor1.value)) awayTeamFontColor.value = "white";
else awayTeamFontColor.value = "black";

if (isLightColor(homeTeamColor1.value)) homeTeamFontColor.value = "white";
else homeTeamFontColor.value = "black";

watch(awayTeamColor1, (n, o) => {
	if (isLightColor(n)) awayTeamFontColor.value = "white";
	else awayTeamFontColor.value = "black";
});

watch(homeTeamColor1, (n, o) => {
	if (isLightColor(n)) homeTeamFontColor.value = "white";
	else homeTeamFontColor.value = "black";
});
/*
	For all of these watchers below, we're adding these if statements
	because we don't want a situation where if a powerplay ends,
	the whole thing goes down while an announcement was up. Likewise, if someone
	turns off an announcement whilst there's a powerplay, we
	don't want the powerplay to go down.
 */

const globalAnnouncement = computed(() => scoreboard.announcement);
const awayAnnouncement = computed(() => scoreboard.awayTeam.announcement);
const homeAnnouncement = computed(() => scoreboard.homeTeam.announcement);

watch(globalAnnouncement, (n, o) => {
	if (n.length === 0 && powerPlaySync.value.type !== "global")
		hideGlobal();
	else
		showGlobal();
})

watch(awayAnnouncement, (n, o) => {
	if (!n.length && powerPlaySync.value.type !== "away")
		hideTeam(awayTeamPos, ".awayTeam");
	else
		showTeam(awayTeamPos, ".awayTeam");
})

watch(homeAnnouncement, (n, o) => {
	if (!n.length && powerPlaySync.value.type !== "home")
		hideTeam(homeTeamPos, ".homeTeam");
	else
		showTeam(homeTeamPos, ".homeTeam");
})

const shootout = computed(() => channels[channelIndex.value].shootout);

watch(shootout, (n, o) => {
	if (!shootout.value) {
		hideTeam(awayTeamPos, ".awayTeam");
		hideTeam(homeTeamPos, ".homeTeam");
	} else {
		showTeam(awayTeamPos, ".awayTeam");
		showTeam(homeTeamPos, ".homeTeam");
	}
})

function forHome() {
	if (!awayTeamOpen) {
		showTeam(awayTeamPos, ".awayTeam");
		awayTeamOpen = !awayTeamOpen;
	}
	if (homeTeamOpen && !scoreboard.homeTeam.announcement.length) {
		hideTeam(homeTeamPos, ".homeTeam");
		homeTeamOpen = !homeTeamOpen;
	}
	if (globalOpen && !scoreboard.announcement.length) {
		hideGlobal();
		globalOpen = !globalOpen;
	}
}

function forAway() {
	if (awayTeamOpen && !scoreboard.awayTeam.announcement.length) {
		hideTeam(awayTeamPos, ".awayTeam");
		awayTeamOpen = !awayTeamOpen;
	}
	if (!homeTeamOpen) {
		showTeam(homeTeamPos, ".homeTeam");
		homeTeamOpen = !homeTeamOpen;
	}
	if (globalOpen && !scoreboard.announcement.length) {
		hideGlobal();
		globalOpen = !globalOpen;
	}
}

function forGlobal() {
	if (awayTeamOpen && !scoreboard.awayTeam.announcement.length) {
		hideTeam(awayTeamPos, ".awayTeam");
		awayTeamOpen = !awayTeamOpen;
	}
	if (homeTeamOpen && !scoreboard.homeTeam.announcement.length) {
		hideTeam(homeTeamPos, ".homeTeam");
		homeTeamOpen = !homeTeamOpen;
	}
	if (!globalOpen) {
		showGlobal();
		globalOpen = !globalOpen;
	}
}

function forNone() {
	if (awayTeamOpen && !scoreboard.awayTeam.announcement.length) {
		hideTeam(awayTeamPos, ".awayTeam");
		awayTeamOpen = !awayTeamOpen;
	}
	if (homeTeamOpen && !scoreboard.homeTeam.announcement.length) {
		hideTeam(homeTeamPos, ".homeTeam");
		homeTeamOpen = !homeTeamOpen;
	}
	if (globalOpen && !scoreboard.announcement.length) {
		hideGlobal();
		globalOpen = !globalOpen;
	}
}

const hockeyAwayTeam = scoreboard.hockey.awayTeam;
const hockeyHomeTeam = scoreboard.hockey.homeTeam;

const powerPlaySync = computed(() => {
  let powerplay = {
    status: "",
    type: "",
  }
	if (hockeyAwayTeam.penalty.player1.number && hockeyAwayTeam.penalty.player2.number) {
		// If two home players are on penalty
		if (hockeyHomeTeam.penalty.player1.number) {
      if (hockeyHomeTeam.penalty.player2.number) {
        powerplay.type = "global";
        powerplay.status = "3 on 3";
        forGlobal();
      } else {
        powerplay.type = "home";
        powerplay.status = "4 on 3";
        forHome();
      }
    } else {
      powerplay.type = "home";
      powerplay.status = "5 on 3";
      forHome();
    }
	}
	// If two home players are on penalty...
	else if (hockeyHomeTeam.penalty.player1.number && hockeyHomeTeam.penalty.player2.number) {
		// If two away players are on penalty
    if (hockeyAwayTeam.penalty.player1.number) {
      if (hockeyAwayTeam.penalty.player2.number) {
        powerplay.type = "global";
        powerplay.status = "3 on 3";
        forGlobal();
      } else {
        powerplay.type = "away";
        powerplay.status = "4 on 3";
        forAway();
      }
    } else {
      powerplay.type = "away";
      powerplay.status = "5 on 3";
      forAway();
    }
	}
	// If either away player is on a penalty...
	else if (hockeyAwayTeam.penalty.player1.number || hockeyAwayTeam.penalty.player2.number) {
		// If either home player is on a penalty...
		if (hockeyHomeTeam.penalty.player1.number || hockeyHomeTeam.penalty.player2.number) {
       powerplay.type = "global";
       powerplay.status = "4 on 4";
       forGlobal();
    } else {
      powerplay.type = "home";
      powerplay.status = "Power Play";
      forHome();
    }
	}
	// If either home player is on a penalty...
	else if (hockeyHomeTeam.penalty.player1.number || hockeyHomeTeam.penalty.player2.number) {
    // If either away player is on a penalty...
    if (hockeyAwayTeam.penalty.player1.number || hockeyAwayTeam.penalty.player2.number) {
      powerplay.type = "global";
      powerplay.status = "4 on 4";
      forGlobal();
    } else {
      powerplay.type = "away";
      powerplay.status = "Power Play";
      forAway();
    }
  } else {
    forNone();
  }
	return powerplay;
});

const powerPlayClock = computed(() => {
	let smallestTime = "";
	const times = [hockeyAwayTeam.penalty.player1.timer, hockeyAwayTeam.penalty.player2.timer,
		hockeyHomeTeam.penalty.player1.timer, hockeyHomeTeam.penalty.player1.timer];

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

const formattedClockTime = computed<string>(() => {
	const minutes = Math.floor(clock.time / 60000).toString();
	let seconds = Math.floor((clock.time % 60000) / 1000).toString();
	const millis = Math.floor((clock.time % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
})

const formattedPeriod = computed<string>(() => {
	if(period.count > period.length) {
		const overtimePeriod = period.count - period.length;
		if (period.count > period.overtime.length + period.length)
			return 'S/O';
		if(overtimePeriod === 1) {
			return 'OT';
		} else {
			return `OT${overtimePeriod}`;
		}
	}

	if(period === undefined) {
		return '1st';
	}

	// Teens for some reason all end in "th" in English.
	if(period.count > 10 && period.count < 20) {
		return period + 'th';
	}

  // For all other numbers up to 99, we need to figure out the suffix.
	const lastNumberOfPeriod = period.count % 10;
	if(lastNumberOfPeriod === 1) {
		return `${period}st`;
	} else if(lastNumberOfPeriod === 2) {
		return `${period}nd`;
	} else if(lastNumberOfPeriod === 3) {
		return `${period}rd`;
	} else {
		return `${period}th`;
	}
});

function computedMessage(message: Announcement) {
	return computed(() => {
		if(!message.timer || !message.timer.visible) {
			return message.message;
		} else {
			const timeRemaining = message.timer.length - (message.timer.startedAt - scoreboard.clock.time);

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


onMounted(() => {
	if (powerPlaySync.value.type === "global" || scoreboard.announcement.length > 0) {
		globalOpen = true;
		showGlobal();
	}
  if (powerPlaySync.value.type === "away" || scoreboard.awayTeam.announcement.length > 0) {
		awayTeamOpen = true;
		showTeam(awayTeamPos, ".awayTeam");
	}
	if (powerPlaySync.value.type === "home" || scoreboard.homeTeam.announcement.length > 0) {
		homeTeamOpen = true;
		showTeam(homeTeamPos, ".homeTeam");
	}
})

</script>

<style scoped scss>
@font-face {
	font-family: "Malgun Gothic Bold";
	src: url("../../../../assets/rpitv-modern/MalgunGothicBold.ttf") format('truetype');
}

@font-face {
	font-family: "Roboto Condensed";
	src: url("../../../../assets/football/RobotoCondensed-Bold.ttf") format('truetype');
}

.scoreboard {
	position: absolute;
	top: 6vh;
	left: 4vw;
	height: 9vh;
	width: 25vw;
	background: v-bind(scoreboardColor);
	font-family: "Malgun Gothic Bold";
	font-weight: bold;
	z-index: 1;
	overflow: hidden;
}

.game-info {
	position: absolute;
	text-align: center;
	width: 25vw;
	height: 4vh;
	background: linear-gradient(#767676 1%, #000000);
	display: flex;
	justify-content: space-around;
	align-items: center;
	color: white;
	z-index: 100;
}
.game-info-child {
	font-size: 3.3vh;
	width: 7vw;
}

.logo {
	display: flex;
	align-items: center;
	justify-content: center;
}

#logoImg {
	height: 2.5vh;
}

.teams {
	position: absolute;
	display: flex;
	justify-content: space-evenly;
	height: 5vh;
	top: 4vh;
	z-index: 1;
}

.home-team-view {
	width: 12.5vw;
	position: absolute;
	left: 0vw;
	height: 5vh;
}

.away-team-view {
	position: absolute;
	left: 12.5vw;
	width: 12.5vw;
	height: 5vh;
}

.global-announcements {
	left: v-bind(announcementsPos);
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-family: "Malgun Gothic Bold";
	position: absolute;
	top: 6vh;
	background: linear-gradient(#FFEF16, #807701);
	height: 9vh;
	width: 8vw;
	font-size: 3.3vh;
	z-index: 0;
	opacity: 0;
	text-shadow: 0 0 0.2vh black;
}
.team-announcements {
	text-shadow: 0 0 0.2vh black;
	position: absolute;
	width: 12.5vw;
	height: 3.5vh;
	background-color: darkgray;
	z-index: 0;
	font-size: 2.3vh;
	font-family: "Malgun Gothic Bold";
	opacity: 0;
}

.awayTeam {
	top: v-bind(awayTeamPos);
	display: flex;
	justify-content: center;
	align-items: center;
	left: 16.5vw;
	background: linear-gradient(v-bind(awayTeamColor1), v-bind(awayTeamColor2));
	color: v-bind(awayTeamFontColor);
}

.homeTeam {
	top: v-bind(homeTeamPos);
	display: flex;
	justify-content: center;
	align-items: center;
	left: 4vw;
	background: linear-gradient(v-bind(homeTeamColor1), v-bind(homeTeamColor2));
	color: v-bind(homeTeamFontColor);
}

.animation {
	position: absolute;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 9vh;
	width: 25vw;
}

.animation-text {
	text-align: center;
	color: black;
	position: absolute;
	z-index: 0;
	height: 9vh;
	bottom: 0.5vh;
	font-family: "Roboto Condensed";
	color: v-bind(animationText);
}

.text2 {
	top: 2.25vh;
	font-size: 4vh;
	white-space: nowrap;
	text-align: center;
	overflow: visible;
	width: 25vw;
}

.show {
	opacity: 1;
	transition: 1s;
}
.hide {
	opacity: 0;
	transition: 1s;
}
</style>
