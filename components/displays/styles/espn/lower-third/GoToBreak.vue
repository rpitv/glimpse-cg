<template>
	<img :src="ESPNGoToBreak" alt="lower_third">
	<div :style="awayTeamName">
		<p>{{ goToBreak.awayTeam.name || awayTeam!.shortName }}</p>
	</div>
	<div :style="awayTeamScore">
		{{ goToBreak.awayTeam.score || scoreboard!.awayTeam.score }}
	</div>
	<div :style="homeTeamName">
		<p>{{ goToBreak.homeTeam.name || homeTeam!.shortName }}</p>
	</div>
	<div :style="homeTeamScore">
		{{ goToBreak.homeTeam.score || scoreboard!.homeTeam.score }}
	</div>
	<div :style="description" ref="scalingDiv">
		<span ref="scalingText" class="scaling-text">
		{{ goToBreak.description.text }}
		{{ goToBreak.description.clock && scoreboard!.clock.time ? `(${formattedClockTime})` : ''}}
		</span>
	</div>
	<div class="colors" :style="awayTeamPrimaryColor">
		<img :style="awayTeamLogo" :src="goToBreak.awayTeam.logo || awayTeam!.logo">
	</div>
	<div class="colors" :style="awayTeamSecondaryColor"></div>
	<div class="colors" :style="homeTeamPrimaryColor">
		<img :style="homeTeamLogo" :src="goToBreak.homeTeam.logo || homeTeam!.logo">
	</div>
	<div class="colors" :style="rightTeamSecondaryColor"></div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";
import ESPNGoToBreak from "assets/espn/GoToBreeak.png";

const replicants = await useReplicants();
const scoreboard = replicants.scoreboard;

const goToBreak = replicants.lowerThird.goToBreak;
const awayTeam = replicants.configuration.awayTeam;
const homeTeam = replicants.configuration.homeTeam;

const scalingDiv = ref<HTMLDivElement>();
const scalingText = ref<HTMLSpanElement>();

const awayTeamName = computed((): CSSProperties => { return {
	alignItems: "center",
	color: goToBreak.awayTeam.nameColor || "#3f403b",
	display: "flex",
	flexWrap: "nowrap",
	fontSize: goToBreak.awayTeam.nameSize + 3.7 + "vh",
	height: "5.55vh",
	justifyContent: "center",
	left: "30.84vw",
	textAlign: "center",
	top: "79.26vh",
	width: "14vw",
}});
const awayTeamScore = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "21.7vh",
	color: goToBreak.awayTeam.scoreColor || "#3f403b",
	display: "flex",
	fontSize: goToBreak.awayTeam.scoreSize +  5.7 + "vh",
	height: "8.3vh",
	justifyContent: "center",
	left: "39.1vw",
	width: "6.2vw",
}});
const homeTeamName = computed((): CSSProperties => { return {
	alignItems: "center",
	color: goToBreak.homeTeam.nameColor || "#3f403b",
	display: "flex",
	flexWrap: "nowrap",
	fontSize: goToBreak.homeTeam.nameSize + 3.7 + "vh",
	height: "5.55vh",
	justifyContent: "center",
	left: "54.75vw",
	textAlign: "center",
	top: "79.26vh",
	width: "14vw",
}});
const homeTeamScore = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "21.7vh",
	color: goToBreak.homeTeam.scoreColor || "#3f403b",
	display: "flex",
	fontSize: goToBreak.homeTeam.scoreSize + 5.7 + "vh",
	height: "8.3vh",
	justifyContent: "center",
	left: "54.5vw",
	width: "6.2vw",
}});
const description = computed((): CSSProperties => { return {
	alignItems: "center",
	bottom: "11.5vh",
	color: goToBreak.description.fontColor || "#3f403b",
	display: "flex",
	fontSize: goToBreak.description.fontSize + 2.36 + "vh",
	fontStyle: "italic",
	height: "4vh",
	justifyContent: "center",
	left: "44.5vw",
	width: "11vw",
}})
const awayTeamSecondaryColor = computed((): CSSProperties => { return {
	backgroundColor: goToBreak.awayTeam.secondaryColor || awayTeam.secondaryColor,
	left: "28.6vw",
	width: "1.84vw"
}});
const awayTeamPrimaryColor = computed((): CSSProperties => { return {
	alignItems: "center",
	backgroundColor: goToBreak.awayTeam.primaryColor || awayTeam.primaryColor,
	display: "flex",
	justifyContent: "center",
	left: "30.7vw",
	width: "8vw",
}});
const homeTeamPrimaryColor = computed((): CSSProperties => { return {
	alignItems: "center",
	backgroundColor: goToBreak.homeTeam.primaryColor || homeTeam.primaryColor,
	display: "flex",
	justifyContent: "center",
	left: "61.1vw",
	width: "8.1vw"
}});
const rightTeamSecondaryColor = computed((): CSSProperties => { return {
	backgroundColor: goToBreak.homeTeam.secondaryColor || homeTeam.secondaryColor,
	left: "69.3vw",
	width: "1.93vw",
}});

const awayTeamLogo = computed((): CSSProperties => { return {
	height: goToBreak.homeTeam.logoSize + "%",
	maxHeight: "9.6vh",
	position: "relative",
	width: "auto",
}});
const homeTeamLogo = computed((): CSSProperties => { return {
	height: goToBreak.homeTeam.logoSize + "%",
	maxHeight: "9.6vh",
	position: "relative",
	width: "auto",
}});

const clock = computed(() => scoreboard.clock);
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
});


const scaleTextToFit = () => {
	const div = scalingDiv.value;
	const text = scalingText.value;

	if (!div || !text) return;

	const divWidth = div.clientWidth;
	let fontSize = 2.36; // Default starting font size
	text.style.fontSize = fontSize + "vh"

	// Adjust font size only if the text exceeds the width
	while (text.offsetWidth > divWidth) {
		fontSize -= 0.2;
		text.style.fontSize = `${fontSize}vh`;

		if (fontSize <= 1) break; // Prevent infinite loop
	}
};

// Watch for changes in the text prop
// watch([goToBreak.description.text, clock.value.time, goToBreak.description.autoFit,
// 			goToBreak.description.fontSize, goToBreak.description.clock],
// 	async () => {
// 		if (!goToBreak.description.autoFit) {
// 			const text = scalingText.value;
// 			if (!text) return;
// 			text.style.fontSize = goToBreak.description.fontSize+ 2.36 + "vh";
// 			return;
// 		}
// 		await nextTick();
// 		scaleTextToFit();
// 	}
// );

// Handle scaling on mount and cleanup on unmount
onMounted(() => {
	scaleTextToFit();
	window.addEventListener("resize", scaleTextToFit);
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", scaleTextToFit);
});

</script>

<style scoped>
.scaling-text {
	white-space: nowrap;
	display: inline-block;
}

@font-face {
	font-family: "swiss721_heavy";
	src: url('~/assets/espn/Swiss721Heavy.ttf')
}

div {
	position: absolute;
	font-family: "swiss721_heavy";
	text-align: center;
}
img {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	transition: opacity 1s;
}
.colors {
	height: 9.6vh;
	bottom: 21.8vh;
}
</style>
