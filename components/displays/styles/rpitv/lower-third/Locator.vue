<template>
	<img class="locator" :src="Locator">
	<div :style="homeTeamPrimaryColor">
		<img :style="homeTeamLogo" :src="locator.homeTeam.logo || homeTeam.logo" :alt="homeTeam.schoolName">
		<div :style="homeTeamName">{{ locator.homeTeam.name || homeTeam.shortName }}</div>
	</div>
	<div :style="awayTeamPrimaryColor">
		<img :style="awayTeamLogo" :src="locator.awayTeam.logo || awayTeam.logo" :alt="awayTeam.schoolName">
		<div :style="awayTeamName">{{ locator.awayTeam.name || awayTeam.shortName }}</div>
	</div>
	<div :style="location">{{ locator.location.name || "Houston Field House" }}</div>
</template>

<script setup lang="ts">
import Locator from "~/assets/rpitv-modern/Locator.png"
import type { CSSProperties } from "vue";
import type { Configuration, LowerThird } from "~/types/replicants";

// background color of the gray in use rgb(133,133,133);
const lowerThird = useReplicant<LowerThird>("lowerThird");
const configuration = useReplicant<Configuration>("configuration");
const locator = computed(() => lowerThird.value!.locator);
const homeTeam = computed(() => configuration.value!.homeTeam);
const awayTeam = computed(() => configuration.value!.awayTeam);

const homeTeamPrimaryColor = computed((): CSSProperties => {return {
	alignItems: "center",
	backgroundColor: locator.value.homeTeam.primaryColor || homeTeam.value.primaryColor,
	bottom: "15.7vh",
	display: "flex",
	height: "17.4vh",
	flexDirection: "column",
	justifyContent: "space-between",
	left: "39.1vw",
	width: "9.2vw",
}});
const awayTeamPrimaryColor = computed((): CSSProperties => {return {
	alignItems: "center",
	backgroundColor: locator.value.awayTeam.primaryColor || awayTeam.value.primaryColor,
	bottom: "15.7vh",
	display: "flex",
	height: "17.4vh",
	flexDirection: "column",
	justifyContent: "space-between",
	left: "51.7vw",
	width: "9.2vw",
}});
const homeTeamLogo = computed((): CSSProperties => {return {
	height: locator.value.homeTeam.logoSize + "%",
	maxHeight: "12.3vh",
}});
const awayTeamLogo = computed((): CSSProperties => {return {
	height: locator.value.awayTeam.logoSize + "%",
	maxHeight: "12.3vh",
}});
const homeTeamName = computed((): CSSProperties => {return {
	color: locator.value.homeTeam.nameColor || "black",
	fontSize: locator.value.homeTeam.nameSize + 1.7 + "vw",
	position: "relative",
	textAlign: "center"
}});
const awayTeamName = computed((): CSSProperties => {return {
	color: locator.value.awayTeam.nameColor || "black",
	fontSize: locator.value.awayTeam.nameSize + 1.7 + "vw",
	position: "relative",
	textAlign: "center"
}});
const location = computed((): CSSProperties => {
	return {
		alignItems: "center",
		backgroundColor: "black",
		color: locator.value.location.nameColor || "#d6001c",
		bottom: "10.7vh",
		display: "flex",
		fontSize: locator.value.location.nameSize + 2.5 + "vh",
		fontWeight: "bolder",
		justifyContent: "center",
		left: "40vw",
		width: "20.1vw",
	}
})

</script>

<style scoped>

@font-face{
	font-family: "Rubik";
	src: url('~/assets/rpitv-modern/Rubik.ttf');
}
div {
	position: absolute;
	font-family: 'Rubik', sans-serif;
	color: white;
}
.locator {
	position: absolute;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
}
#homeFill {
	position: absolute;
	left: 39.1vw;
	bottom: 15.7vh;
	width: 9.2vw;
	height: 17.4vh;
}
#awayFill {
	position: absolute;
	left: 51.7vw;
	bottom: 15.7vh;
	width: 9.2vw;
	height: 17.4vh;
}
.logo {
	position: absolute;
	justify-content: center;
	display: flex;
	left: 0;
}
.logo > img {
	width: auto;
	height: auto;
	max-width: 9vw;
	max-height: 12.3vh;
}
#homeTeam{
	position: absolute;
	text-align: center;
	bottom: 16.2vh;
	width: 87.3vw;
	left: 0;
	font-size: 2.4vh;
}

#homeLogo {
	width: 87.3vw;
	bottom: 19.8vh;
}

#homeLogo > img {
	position: relative;
}

#awayTeam {
	position: absolute;
	text-align: center;
	bottom: 16.2vh;
	width: 112.6vw;
	left: 0;
	font-size: 2.4vh;
}

#awayLogo {
	width: 112.6vw;
	bottom: 19.8vh;
}

#awayLogo > img {
	position: relative;
}
</style>
