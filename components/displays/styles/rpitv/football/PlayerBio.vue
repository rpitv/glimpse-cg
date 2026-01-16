<template>
  <div class="scoreboard-container">
    <div
      class="scoreboard"
      :style="scoreboard"
    >
      <img
        class="player-img"
        :src="playerBio.imageURL ?? ''"
      >
      <div :style="action">
        {{ playerBio.description ? playerBio.description : "" }}
        {{ playerBio.playerNumber ? "#" + playerBio.playerNumber: "" }}
        {{ playerBio.playerName ?? "" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue';
import { calcLinearGrad, isLighter, isLightColor } from '../../../util';

const replicants = await useReplicants();
const playerBio = replicants.lowerThird.playerBio;
const awayTeam = replicants.configuration.awayTeam;
const homeTeam = replicants.configuration.homeTeam;

const linearGrad = ref<string>('');

const teamColor = computed(() => {
  const color = playerBio.playerColor || playerBio.teamside === 'awayTeam' ? awayTeam.primaryColor : homeTeam.primaryColor;
  linearGrad.value = calcLinearGrad(color);
  return color;
});

const scoreboard = computed((): CSSProperties => {
  return {
    position: 'fixed',
    color: isLightColor(teamColor.value) ? 'white' : 'black',
    background: isLighter(teamColor.value, linearGrad.value) ? `linear-gradient(${teamColor.value}, ${(linearGrad.value)})` : `linear-gradient(${linearGrad.value}, ${(teamColor.value)})`,
    bottom: playerBio.offsetY + 5.93 + 'vh',
    display: 'flex',
    height: '10.2vh',
    overflow: 'hidden',
    width: '77.35vw',
  };
});

const action = computed((): CSSProperties => {
  return {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    bottom: playerBio.offsetY + 10 + 'vh',
    height: '9.7vh',
    left: playerBio.offsetX + 'vw',
    marginLeft: '3vw',
    fontSize: playerBio.fontSize + 7 + 'vh',
  };
});
</script>

<style scoped>
@font-face {
	font-family: "Roboto Condensed";
	src: url("~/assets/football/RobotoCondensed-Bold.ttf") format('truetype');
}

.scoreboard-container {
	display: flex;
    font-family: "Roboto Condensed";
	justify-content: center;
}

.scoreboard {
	display: flex;
	color: black;
	font-weight: bolder;
	text-shadow: 2px 2px 4px #292929;
	border-radius: 2vh 2vh 2vh 2vh;
	filter: drop-shadow(1vh 1vh 1vh #111111);
}

.player-img {
	position: relative;
	top: 2vh;
	height: 100%;
	width: auto;
	scale: 1.5;
	left: 0.8vw;
}
</style>
