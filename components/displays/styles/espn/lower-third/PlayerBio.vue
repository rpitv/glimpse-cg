<template>
	<img :src="PlayerBio">
	<div :style="imageBackground">
		<div class="image-container">
			<img class="player-img" :src="playerBio.imageURL ?? ''">
		</div>
	</div>
	<div :style="action">
		{{ playerBio.description ? playerBio.description : "" }}
		{{ playerBio.playerNumber ? "#" + playerBio.playerNumber: "" }}
		{{ playerBio.playerName ?? "" }}
	</div>
	<div :style="info" class="info">
		<span v-for="(item, i) in infoItemsFiltered" :class="{
			'info-item': true,
			'espn-border': (i < (infoItemsFiltered.length - 1)),
			'padding-left': i !== 0,
		}">
			{{ item }}
		</span>
	</div>
</template>

<script setup lang="ts">
import PlayerBio from "~/assets/espn/playerBio.png";
import { computed, type CSSProperties } from "vue";
import type { Configuration, LowerThird } from "~/types/replicants";

const replicants = await useReplicants();
const playerBio = replicants.lowerThird.playerBio;
const awayTeam = replicants.configuration.awayTeam;
const homeTeam = replicants.configuration.homeTeam;


const imageBackground = computed((): CSSProperties => {
	const color = playerBio.playerColor || playerBio.teamside === "awayTeam" ? awayTeam.primaryColor : homeTeam.primaryColor;

	return {
		position: "absolute",
		backgroundColor: color,
		bottom: playerBio.offsetY + 9.45 + "vh",
		display: "flex",
		justifyContent: "center",
		height: "10.7vh",
		left: playerBio.offsetX + 14.7 + 'vw',
		overflow: "hidden",
		width: "11.3vw",
	}
});

const action = computed((): CSSProperties => {
	return {
		color: "#3F3F3F",
		display: "flex",
		alignItems: "center",
		position: "absolute",
		bottom: playerBio.offsetY + (playerBio.info.show ? 12 : 10) + "vh",
		height: "9.7vh",
		left: playerBio.offsetX + 26.5 + 'vw',
		marginLeft: "1vw",
		width: "58.5vw",
		fontSize: playerBio.fontSize + (playerBio.info.show ? 3 : 5) + "vh",
	}
});

const info = computed((): CSSProperties => {
	return {
		opacity: playerBio.info.show ? 100 : 0,
		color: "#3F3F3F",
		display: "flex",
		alignItems: "center",
		position: "absolute",
		bottom: "7.4vh",
		height: "8.9vh",
		left: "26.5vw",
		marginLeft: "1vw",
		width: "58.5vw",
		fontSize: "3vh",
	}
});


const infoItemsFiltered = computed(() => {
	return [
		playerBio.info.height,
		playerBio.info.year,
		playerBio.info.weight,
		playerBio.info.hometown
	].filter(item => item && item !== "")
})
</script>

<style scoped lang="scss">
img {
	height: 100vh;
	width: 100vw;
}

@font-face {
	font-family: "swiss721_heavy";
	src: url('~/assets/espn/Swiss721Heavy.ttf')
}
div {
	position: absolute;
	font-family: "swiss721_heavy";
}
.player-img {
	position: relative;
	top: 2vh;
	height: 100%;
	width: auto;
	scale: 1.5;
	left: 2.7vw;
}

.image-container {
	display: flex;
	justify-content: center;
	height: 100%;
}

.info-item {
	font-family: "swiss721_med";
	display: flex;
	flex-direction: column;
	padding-bottom: 0.08vh;
	padding-right: 0.5vw;
}

.info-item.espn-border {
	box-shadow: 0 0 0 0 #b9b9b9, 0.2vw 0 0 0 #b9b9b9;
}

.info-item.padding-left {
	padding-left: 0.5vw;
}
</style>
