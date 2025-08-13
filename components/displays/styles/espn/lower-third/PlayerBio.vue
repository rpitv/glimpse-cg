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
			'border': (i < (infoItemsFiltered.length - 1)),
			'padding-left': i !== 0,
		}">
			{{ item }}
		</span>
	</div>
</template>

<script setup lang="ts">
import PlayerBio from "~/assets/espn/playerBio.png";
import { computed, type CSSProperties } from "vue";
import type { Channels, Configuration, LowerThird } from "~/types/replicants";

const route = useRoute();
let channelIndex = ref(0);
if (route.query.channel)
	channelIndex.value = parseInt(route.query.channel as string);

const lowerThird = await useReplicant<LowerThird>("lowerThird");
const configuration = await useReplicant<Configuration>("configuration");
const channels = await useReplicant<Channels>("channels");
const playerBio = computed(() => lowerThird.value!.playerBio);
const awayTeam = computed(() => configuration.value?.awayTeam);
const homeTeam = computed(() => configuration.value?.homeTeam);


const imageBackground = computed((): CSSProperties => {
	const color = playerBio.value.playerColor || playerBio.value.teamside === "awayTeam" ? awayTeam.value?.primaryColor : homeTeam.value?.primaryColor;

	return {
		position: "absolute",
		backgroundColor: color,
		bottom: playerBio.value.offsetY + 9.45 + "vh",
		display: "flex",
		justifyContent: "center",
		height: "10.7vh",
		left: playerBio.value.offsetX + 14.7 + 'vw',
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
		bottom: playerBio.value.offsetY + (channels.value![channelIndex.value].playerBio ? 12 : 10) + "vh",
		height: "9.7vh",
		left: playerBio.value.offsetX + 26.5 + 'vw',
		marginLeft: "1vw",
		width: "58.5vw",
		fontSize: playerBio.value.fontSize + (channels.value![channelIndex.value].playerBio ? 3 : 5) + "vh",
	}
});

const info = computed((): CSSProperties => {
	return {
		opacity: channels.value![channelIndex.value].playerBio ? 100 : 0,
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
		playerBio.value.height,
		playerBio.value.year,
		playerBio.value.weight,
		playerBio.value.hometown
	].filter(item => item !== "")
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

.info-item.border {
	box-shadow: 0 0 0 0 #b9b9b9, 0.2vw 0 0 0 #b9b9b9;
}

.info-item.padding-left {
	padding-left: 0.5vw;
}
</style>
