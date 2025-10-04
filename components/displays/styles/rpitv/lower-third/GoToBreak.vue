<template>
	<img class="scoreboard" :src="ScoreboardGraphic">
	<div class="colors" :style="homeTeamPrimaryColor">
		<img :style="homeTeamLogo" :src="gtbHomeTeam.logo || homeTeam.logo" :alt="homeTeam.schoolName">
		<div :style="homeTeamName"> {{ gtbHomeTeam.name || homeTeam.shortName }}</div>
	</div>
	<div class="colors" :style="awayTeamPrimaryColor">
		<img :style="rightTeamLogo" :src="gtbAwayTeam.logo || awayTeam.logo" :alt="awayTeam.shortName">
		<div :style="rightTeamName"> {{ gtbAwayTeam.name || awayTeam.shortName }}</div>
	</div>
	<div :style="homeTeamScore"> {{ gtbHomeTeam.score || scoreboard.homeTeam.score }}</div>
	<div :style="rightTeamScore"> {{ gtbAwayTeam.score || scoreboard.awayTeam.score }}</div>
	<div :style="description">
		{{ goToBreak.description.text || period }}
		{{ goToBreak.description.clock && clock.time ? `(${formattedClockTime})` : ''}}
	</div>
</template>

<script setup lang="ts">
import ScoreboardGraphic from "~/assets/rpitv-modern/Scoreboard.png"
import type { CSSProperties } from "vue";

const replicants = await useReplicants();
const scoreboard = replicants.scoreboard;
const goToBreak = replicants.lowerThird.goToBreak;
const gtbHomeTeam = goToBreak.homeTeam;
const gtbAwayTeam = goToBreak.awayTeam;
const homeTeam = replicants.configuration.homeTeam;
const awayTeam = replicants.configuration.awayTeam;


const homeTeamName = computed((): CSSProperties => { return {
	color: gtbHomeTeam.nameColor,
	fontSize: gtbHomeTeam.nameSize + 2.5 + "vh",
	position: "relative",
	textAlign: "center",
}});
const homeTeamScore = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "16.6vh",
	color: gtbHomeTeam.scoreColor,
	display: "flex",
	fontSize: gtbHomeTeam.scoreSize + 11 + "vh",
	height: "17.4vh",
	justifyContent: "space-around",
	left: "39.5vw",
	width: "10.5vw",
}});
const rightTeamName = computed((): CSSProperties => { return {
	color: gtbAwayTeam.nameColor,
	fontSize: gtbAwayTeam.nameSize + 2.5 + "vh",
	position: "relative",
	textAlign: "center",
}});
const rightTeamScore = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "16.6vh",
	color: gtbAwayTeam.scoreColor,
	display: "flex",
	fontSize: gtbAwayTeam.scoreSize + 11 + "vh",
	height: "17.4vh",
	justifyContent: "space-around",
	left: "50vw",
	width: "10.5vw",
}});
const description = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "11.5vh",
	color: goToBreak.description.fontColor,
	display: "flex",
	fontSize: goToBreak.description.fontSize + 2.2 + "vh",
	height: "3.4vh",
	justifyContent: "center",
	left: "42.7vw",
	width: "14.6vw",
}})
const homeTeamPrimaryColor = computed((): CSSProperties => { return {
	alignItems: "center",
	backgroundColor: gtbHomeTeam.primaryColor,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	left: "29vw",
	width: "9.2vw",
}});
const awayTeamPrimaryColor = computed((): CSSProperties => { return {
	alignItems: "center",
	backgroundColor: gtbAwayTeam.primaryColor,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	left: "61.8vw",
	width: "9.2vw"
}});
const homeTeamLogo = computed((): CSSProperties => { return {
	height: gtbHomeTeam.logoSize + "%",
	maxHeight: "14vh",
}});
const rightTeamLogo = computed((): CSSProperties => { return {
	height: gtbAwayTeam.logoSize + "%",
	maxHeight: "14vh",
}});

const clock = replicants.scoreboard.clock;

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
});
const period = ref<string>();


// function periodTextHockey() {
// 	const scoreboardPeriod = replicants.scoreboard.period.value;
// 	if (scoreboardPeriod === 1)
// 		period.value = "End of 1st";
// 	if (scoreboardPeriod === 2)
// 		period.value = "End of 2nd";
// 	// If the team's score are the same and we're nearing the third period...
// 	if (replicants.teams[0].score.value === replicants.teams[1].score.value) {
// 		if (scoreboardPeriod === 3)
// 			period.value = "End of Reg.";
// 		// If there is no shootout...
// 		if (!replicants.gameSettings.periods.shootouts.value) {
// 			// If there is no 2nd overtime...
// 			if (scoreboardPeriod === 4 && replicants.gameSettings.periods.overtime.count.value < 2)
// 				period.value = "Final OT";
// 			// If there is 2nd overtime...
// 			if (scoreboardPeriod === 4 && replicants.gameSettings.periods.overtime.count.value >= 2)
// 				period.value = "End 1st OT";
// 			if (scoreboardPeriod === 5)
// 				period.value = "Final OT";
// 		}
// 		// If there is shootout...
// 		if (replicants.gameSettings.periods.shootouts.value) {
// 			// If there is no 2nd overtime...
// 			if (scoreboardPeriod === 4 && replicants.gameSettings.periods.overtime.count.value < 2)
// 				period.value = "End of OT";
// 			if (scoreboardPeriod === 5 && replicants.gameSettings.periods.overtime.count.value < 2)
// 				period.value = "Final SO";
// 			// If there is 2nd overtime...
// 			if (scoreboardPeriod === 4 && replicants.gameSettings.periods.overtime.count.value === 2)
// 				period.value = "End 1st OT";
// 			if (scoreboardPeriod === 5 && replicants.gameSettings.periods.overtime.count.value === 2)
// 				period.value = "End 2nd OT";
// 			if (scoreboardPeriod === 6 && replicants.gameSettings.periods.overtime.count.value === 2)
// 				period.value = "Final SO";
// 		}
// 	} else {
// 		// If the team's score are not the same and we're at/past the third period...
// 		if (scoreboardPeriod === 3)
// 			period.value = "Final";
// 		// If there is no shootout...
// 		if (!replicants.gameSettings.periods.shootouts.value && scoreboardPeriod >= 4)
// 			period.value = "Final OT";
// 		// If there is shootout...
// 		if (replicants.gameSettings.periods.shootouts.value && scoreboardPeriod >= 4) {
// 			if (scoreboardPeriod >= 4 && scoreboardPeriod <= 5)
// 				period.value = "Final OT";
// 			if (scoreboardPeriod === 6)
// 				period.value = "Final SO";
// 		}
// 	}
// }

// watch(replicants.lowerThird.scoreboard, (newValue, oldValue) => {
// 	if (newValue) {
// 		team0Score.value = replicants.teams[0].score.value;
// 		team1Score.value = replicants.teams[1].score.value;
// 		// potentially useless 'if' block
// 		if (replicants.sync.selectedSport.value === "Hockey/Lacrosse" || replicants.sync.selectedSport.value === "Football" ) {
// 			if (replicants.gameSettings.periods.count.value === 3) {
// 				periodTextHockey();
// 			} else { // assuming 4 period max for all other cases (lacrosse)
// 				const scoreboardPeriod = replicants.scoreboard.period.value;
// 				if (scoreboardPeriod === 1)
// 					period.value = "End of 1st";
// 				else if (scoreboardPeriod === 2)
// 					period.value = "End of 2nd";
// 				else if (scoreboardPeriod === 3)
// 					period.value = "End of 3rd";
// 				else if (scoreboardPeriod === 4 && team0Score.value === team1Score.value)
// 					period.value = "End of Regulation";
// 				else if (scoreboardPeriod === 4)
// 					period.value = "Final";
// 				else if (scoreboardPeriod === 5)
// 					period.value = "End of OT";
// 			}
// 		}
// 	}
// });
</script>


<style scoped>
@font-face {
	font-family: "Rubik";
	src: url('~/assets/rpitv-modern/Rubik.ttf');
}
div {
	position: absolute;
	font-family: 'Rubik', sans-serif;
}
.scoreboard {
	position: absolute;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
}
.colors {
	bottom: 16.6vh;
	height: 17.4vh;
}
</style>
