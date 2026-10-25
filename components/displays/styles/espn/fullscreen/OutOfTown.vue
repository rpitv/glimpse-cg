<template>
  <img
    class="fullscreen"
    :src="FullScreen"
  >
  <div class="header">
    <p>ECAC Out of Town Scoreboard</p>
  </div>
  <div class="out-of-town">
    <div class="team" v-for="(team, i) of outOfTown.teams" :key="outOfTown.teams[i]!.details.homeTeam">
      <div v-if="outOfTown.teams[i]!.show" class="flex items-center justify-center gap-[0.5vw]">
        <div class="flex flex-col justify-center items-center">
          <img class="logo" :src="outOfTown.teams[i]!.details.homeLogo">
          <p class="team-name text-center font-semibold">{{ outOfTown.teams[i]!.details.homeTeam }}</p>
        </div>
        <div class="middle flex flex-col items-center">
          <p class="vs">VS</p>
          <p>{{ outOfTown.teams[i]!.details.score }}</p>
          <p :class="`${outOfTown.teams[i]!.details.clock.toLowerCase() === 'final' ? 'font-bold' : ''}`">{{ outOfTown.teams[i]!.details.clock.toUpperCase() }}</p>
        </div>
        <div class="flex flex-col items-center">
          <img class="logo" :src="outOfTown.teams[i]!.details.visitingLogo" >
          <p class="team-name text-center font-semibold ">{{ outOfTown.teams[i]!.details.visitingTeam }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FullScreen from '~/assets/espn/FullScreen.png';
import type { CSSProperties } from 'vue';
import { computed } from 'vue';

const replicants = await useReplicants();
const outOfTown = replicants.fullscreen.outOfTown;
</script>

<style scoped lang="scss">
@font-face {
	font-family: "swiss721_heavy";
	src: url('~/assets/espn/Swiss721Heavy.ttf');
}
@font-face {
	font-family: "swiss721_med";
	src: url('~/assets/espn/Swiss721Medium.ttf');
}


.fullscreen {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
}

.out-of-town {
  position: absolute;
  top: 23vh;
  left: 9vw;
  width: 82vw;
  height: 59vh;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: min-content;
  gap: 6vh 3vw;
  color: black;
  place-items: center;
}

.logo {
  height: 12vh;
  filter: drop-shadow(0.2vh 0.2vh 0.2vh #000000)
}

.vs {
  background-color: #da291c;
  color: white;
  padding: 1vh;
  font-weight: 500;
	font-family: "swiss721_med";
  width: fit-content;
}

.middle {
  font-size: 1.7vh;
}

.team {
  width: 100%;
}

.team-name {
  font-size: 1.7vh;
}

.header {
  bottom: 80vh;
  display: flex;
  font-size: 5vh;
  left: 11vw;
  position: absolute;
	color: #2d2c2c;
	font-family: "swiss721_med";
}
</style>
