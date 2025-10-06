<template>
	<div class="scoreboard-container">
		<div class="scoreboard">
			<div class="rpitv">
				<img :src="rpitvBug" class="logo">
			</div>
			<TeamView class="team" team="awayTeam"/>
			<TeamView class="team" team="homeTeam" />
			<div class="clock-period">
				<div class="period">
					{{ formattedPeriod.toUpperCase() }}
				</div>
				<div class="clock">
					{{ formattedClockTime }}
				</div>
			</div>
			<div class="play-clock">{{ scoreboard!.football.playClock }}</div>
			<div :class="'down-counter-announcements ' + (announcement.length ? 'announcement' : 'down')">
				{{announcement ? announcement :	`${getSuffix(scoreboard!.football.down)}` }}
			</div>
		</div>
	</div>
	<div class="animation-container">
		<div :class="'animation'">
			<div class="animation-text">
			</div>
			<div class="image-container">
				<img v-for="(i) in 10" :class="'animation-image ' + `image${i}`" :src="scoreImage">
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import TeamView from "./TeamView.vue";
import rpitvBug from "~/assets/football/rpitv_logo.png";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { isLightColor, calcLinearGrad, isLighter } from "../../../util";

gsap.registerPlugin(CustomEase);
const replicants = await useReplicants();

const scoreboard = replicants.scoreboard;
const configuration = replicants.configuration;
const awayTeam = configuration.awayTeam;
const homeTeam = configuration.homeTeam;
const clock = computed(() => scoreboard.clock);
const period = computed(() => scoreboard.period);

const backgroundColor1 = ref<string>("#FFF700");
const backgroundColor2 = ref<string>("#807C00");
const announcementTextColor = ref<string>("white");

const announcement = computed(() => {
	let currentState = "";
	let linearGrad: string;
	if (scoreboard.awayTeam.announcement[0]?.message) {
		currentState = scoreboard.awayTeam.announcement[0]?.message;
		linearGrad = calcLinearGrad(awayTeam.primaryColor);
		if (isLighter(awayTeam.primaryColor, linearGrad)) {
			backgroundColor1.value = awayTeam.primaryColor;
			backgroundColor2.value = linearGrad;
		} else {
			backgroundColor1.value = linearGrad;
			backgroundColor2.value = awayTeam.primaryColor;
		}
	} else if (scoreboard.homeTeam.announcement[0]?.message) {
		currentState =  scoreboard.homeTeam.announcement[0]?.message;
		linearGrad = calcLinearGrad(homeTeam.primaryColor);
		if (isLighter(homeTeam.primaryColor, linearGrad)) {
			backgroundColor1.value = homeTeam.primaryColor;
			backgroundColor2.value = linearGrad;
		} else {
			backgroundColor1.value = linearGrad;
			backgroundColor2.value = homeTeam.primaryColor;
		}
	} else {
		backgroundColor1.value = "#FFF700";
		backgroundColor2.value = "#807C00";
	}
	if (scoreboard.announcement[0]?.message) {
		currentState = scoreboard.announcement[0]?.message;
		backgroundColor1.value = "#FFF700";
		backgroundColor2.value = "#807C00";
	}
	announcementTextColor.value = isLightColor(backgroundColor1.value) ? "white" : "black";
	return currentState;
})

const formattedClockTime = computed<string>(() => {
	const minutes = Math.floor(clock.value.time / 60000).toString();
	let seconds = Math.floor((clock.value.time % 60000) / 1000).toString();
	const millis = Math.floor((clock.value.time % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
})

function getSuffix(n: number, period=false) {
	if (!n)
		return "";
	let ytg: string = "";
	if (!period)
		ytg = ` & ${scoreboard.football.yardsToGo}`;
	if(n == 1) {
		return `${n}ST` + ytg;
	} else if(n == 2) {
		return `${n}ND` + ytg;
	} else if(n == 3) {
		return `${n}RD` + ytg;
	} else {
		return `${n}TH` + ytg;
	}
}

const formattedPeriod = computed<string>(() => {
	if (period.value.count > period.value.length) {
		const overtimePeriod = period.value.count - period.value.length;
		if(overtimePeriod === 1) {
			return 'OT';
		} else {
			return `OT${overtimePeriod}`;
		}
	}

	if(period.value === undefined) {
		return '1st';
	}

	// Teens for some reason all end in "th" in English.
	if(period.value.count > 10 && period.value.count < 20) {
		return period.value + 'th';
	}

	// For all other numbers, we need to figure out the suffix.
	const lastNumberOfPeriod = period.value.count % 10;
	return getSuffix(lastNumberOfPeriod, true);
});

function grabScoreType (n: number, teamName: "awayTeam" | "homeTeam"): string[] {
	const animationText = ["", ""];
	if (n == 6)
		animationText[0] = "TOUCHDOWN";
	if (n == 3)
		animationText[0] = "FIELD GOAL"
	animationText[1] = configuration[teamName].shortName;
	return animationText;
}

const stagger = 0.3;
function runAnimation() {
	const t1 = gsap.timeline();
	const t2 = gsap.timeline();
	const t3 = gsap.timeline();
	// Element goes from hidden to shown for 1 second
	t1.fromTo(".animation", {opacity: 0}, {duration: 1, opacity: 1});
	// Gets goal type (touchdown or field goal) and slowly spaces it out
	t1.fromTo(".animation-text", {letterSpacing: "normal", opacity: 0}, {
		duration: 3,
		innerText: String(scoreType.value[0]).toUpperCase(),
		letterSpacing: "4vw",
		ease: CustomEase.create("custom", "M0,0 C0.04,0.122 0.043,0.235 0.07,0.338 0.125,0.554 0.194,0.721 0.302,0.822 0.494,1.002 0.818,1.001 1,1 "),
		opacity: 1
	}, "-=0.25");
	// Text disappears before the animation fully ends
	t1.to(".animation-text", { duration: 1, opacity: 0}, "-=0.25");
	// Gets the team name and slowly spaces it out
	t1.fromTo(".animation-text", {letterSpacing: "1vw"}, {
		duration: 2,
		innerText: String(scoreType.value[1]).toUpperCase(),
		opacity: 1,
		letterSpacing: "2vw",
		ease: CustomEase.create("custom", "M0,0 C0.04,0.122 0.043,0.235 0.07,0.338 0.125,0.554 0.194,0.721 0.302,0.822 0.494,1.002 0.818,1.001 1,1 ")
	}, "-=0.15");
	// Whilst t1 is happening, we can have another element change, which will have the images go up and down
	t2.fromTo(".animation-image", {top: "6.6vh"},
		{duration: 3, top: "0.5vh", stagger: stagger, ease: CustomEase.create("custom", "M0,0 C0.104,0.204 0.456,2.144 1,0 ")}, "+=1");
	t1.to(".animation", {duration: 1, opacity: 0}, "+=0.75");
	t3.fromTo(".animation-image", {"--rotate": "0deg"}, {duration: 6, "--rotate": "720deg", stagger: stagger}, "+=1");
}

const scoreType = ref<string[]>([]);
const scoreImage = ref<string>("");

const teamColor1 = ref<string>("");
const teamColor2 = ref<string>("");

const nameColor = ref<string>("");

const awayTeamScore = computed(() => scoreboard.awayTeam.score);
const homeTeamScore = computed(() => scoreboard.homeTeam.score);

watch(awayTeamScore, (n, o) => {
	scoreType.value = grabScoreType(n - o, "awayTeam");
	if (!scoreType.value[0])
		return;
	scoreImage.value = awayTeam.logo;
	const linearGradient = calcLinearGrad(awayTeam.primaryColor);
	if (!isLighter(awayTeam.primaryColor, linearGradient)) {
		teamColor2.value = awayTeam.primaryColor;
		teamColor1.value = linearGradient;
		nameColor.value =  isLightColor(teamColor2.value) ? "white" : "black";
	} else {
		teamColor1.value = awayTeam.primaryColor;
		teamColor2.value = linearGradient;
		nameColor.value =  isLightColor(teamColor1.value) ? "white" : "black";
	}
	runAnimation();
})

watch(homeTeamScore, (n, o) => {
	scoreType.value = grabScoreType(n - o, "homeTeam");
	if (!scoreType.value[0])
		return;
	scoreImage.value = homeTeam.logo;
	const linearGradient = calcLinearGrad(homeTeam.primaryColor);
	if (!isLighter(homeTeam.primaryColor, linearGradient)) {
		teamColor2.value = homeTeam.primaryColor;
		teamColor1.value = linearGradient;
		nameColor.value =  isLightColor(teamColor2.value) ? "white" : "black";
	} else {
		teamColor1.value = homeTeam.primaryColor;
		teamColor2.value = linearGradient;
		nameColor.value =  isLightColor(teamColor1.value) ? "white" : "black";
	}
	runAnimation();
});

const possessionColors = computed(() => {
	const colors = ["#2b2b2b", "#dfdfdf", "black"];
	if (scoreboard.football.possession === '<') {
		const linearGradient = calcLinearGrad(awayTeam.primaryColor);
		if (!isLighter(awayTeam.primaryColor, linearGradient)) {
			colors[0] = awayTeam.primaryColor;
			colors[1] = linearGradient;
			colors[2] = isLightColor(colors[0]) ? "white" : "black";
		} else {
			colors[1] = awayTeam.primaryColor;
			colors[0] = linearGradient;
			colors[2] =  isLightColor(colors[1]) ? "white" : "black";
		}
	} else if (scoreboard.football.possession === '>') {
		const linearGradient = calcLinearGrad(homeTeam.primaryColor);
		if (!isLighter(homeTeam.primaryColor, linearGradient)) {
			colors[0] = homeTeam.primaryColor;
			colors[1] = linearGradient;
			colors[2] = isLightColor(colors[0]) ? "white" : "black";
		} else {
			colors[1] = homeTeam.primaryColor;
			colors[0] = linearGradient;
			colors[2] =  isLightColor(colors[1]) ? "white" : "black";
		}
	}
	return colors;
})

</script>

<style scoped lang="scss">
@font-face {
	font-family: "Malgun Gothic";
	src: url("~/assets/football/malgun.ttf") format('truetype');
}
@font-face {
	font-family: "Roboto Condensed";
	src: url("~/assets/football/RobotoCondensed-Bold.ttf") format('truetype');
}

.scoreboard-container {
	display: flex;
	justify-content: center;
}

.scoreboard {
	filter: drop-shadow(1vh 1vh 1vh #111111);
	position: fixed;
	top: 84.07vh;
	width: 77.35vw;
	height: 6.2vh;
	display: flex;
}

.show {
	opacity: 1;
	transition: 1s;
}

.hidden {
	opacity: 0;
	transition: 1s;
}

.rpitv {
	width: 8.2vw;
	height: 6.2vh;
	background: linear-gradient(#4E4E4E, #181818);
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 2vh 0 0 2vh;
}

.logo {
	width: 6.7vw;
	height: 4.56vh;
}

.clock-period {
	display: flex;
	width: 12vw;
	height: 6.2vh;
	background: linear-gradient(#9D9595, #2E2D2D);
	font-size: 4.56vh;
	color: white;
	justify-content: space-around;
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
	align-items: center;
	font-family: "Malgun Gothic";
	font-weight: bold;
}


.play-clock {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 4.45vw;
	height: 6.2vh;
	background: linear-gradient(#C5C5C5, #636363);
	font-size: 4.56vh;
	text-align: center;
	font-family: "Malgun Gothic";
	font-weight: bold;
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
}



.down-counter-announcements {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 20.7vw;
	height: 6.2vh;
	font-family: "Malgun Gothic";
	font-weight: bold;
	font-size: 4.3vh;
	border-radius: 0 2vh 2vh 0;
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
}

.announcement {
	background: linear-gradient(v-bind(backgroundColor1), v-bind(backgroundColor2));
	color: v-bind(announcementTextColor);
}

.down {
	--color1: v-bind(possessionColors[0]);
	--color2: v-bind(possessionColors[1]);
	--color3: v-bind(possessionColors[2]);
	background: linear-gradient(var(--color2), var(--color1));
	color: var(--color3);
}

.animation-container {
	display: flex;
	justify-content: center;
	align-items: center;
}

.animation {
	display: flex;
	opacity: 1;
	top: 84.07vh;
	width: 77.35vw;
	height: 6.2vh;
	position: fixed;
	color: v-bind(nameColor);
	text-align: center;
	font-weight: bolder;
	text-shadow: 2px 2px 4px #292929;
	border-radius: 2vh 2vh 2vh 2vh;
	background: linear-gradient(v-bind(teamColor1), v-bind(teamColor2));
}

.animation-text {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 77.35vw;
	position: fixed;
	bottom: 9vh;
	font-size: 6.2vh;
	font-family: 'Roboto Condensed', sans-serif;
}

.image-container {
	display: flex;
	justify-content: space-around;
	width: 77.35vw;
	height: 6.2vh;
	overflow: hidden;
}

.animation-image {
	--rotate: 0deg;
	position: relative;
	height: 3.1vh;
	top: 6vh;
	z-index: -5;
	filter: drop-shadow(0.2vh 0.2vw 0.2vw black);
	rotate: var(--rotate);
}

</style>
