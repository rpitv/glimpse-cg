<template>
  <img
    class="locator"
    :src="Locator"
  >
  <div :style="awayTeamSecondaryColor" />
  <div :style="awayTeamPrimaryColor">
    <img
      :style="awayTeamLogo"
      :src="locator.awayTeam.logo || awayTeam.logo"
    >
  </div>
  <div :style="homeTeamSecondaryColor" />
  <div :style="homeTeamPrimaryColor">
    <img
      :style="homeTeamLogo"
      :src="locator.homeTeam.logo || homeTeam.logo"
    >
  </div>
  <div :style="awayTeamName">
    {{ locator.awayTeam.name || awayTeam.shortName }}
  </div>
  <div :style="homeTeamName">
    {{ locator.homeTeam.name || homeTeam.shortName }}
  </div>
  <div :style="location	" />
</template>

<script setup lang="ts">
import Locator from '~/assets/espn/Locator.png';
import type { CSSProperties } from 'vue';
import { computed } from 'vue';
import type { Configuration, LowerThird } from '~/types/replicants';

const replicants = await useReplicants();

const locator = replicants.lowerThird.locator;
const awayTeam = replicants.configuration.awayTeam;
const homeTeam = replicants.configuration.homeTeam;

const awayTeamSecondaryColor = computed((): CSSProperties => {
  return {
    backgroundColor: locator.awayTeam.secondaryColor || awayTeam.secondaryColor,
    bottom: '22.1vh',
    height: '9.6vh',
    left: '29.3vw',
    width: '2.7vw',
  };
});
const awayTeamPrimaryColor = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    backgroundColor: locator.awayTeam.primaryColor || awayTeam.primaryColor,
    bottom: '22.1vh',
    display: 'flex',
    height: '9.6vh',
    justifyContent: 'center',
    left: '32.4vw',
    width: '11.8vw',
  };
});
const homeTeamPrimaryColor = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    backgroundColor: locator.homeTeam.primaryColor || homeTeam.primaryColor,
    bottom: '22.1vh',
    display: 'flex',
    height: '9.6vh',
    justifyContent: 'center',
    left: '55.5vw',
    width: '11.9vw',
  };
});
const homeTeamSecondaryColor = computed((): CSSProperties => {
  return {
    backgroundColor: locator.homeTeam.secondaryColor || homeTeam.secondaryColor,
    bottom: '22.1vh',
    height: '9.6vh',
    left: '67.6vw',
    width: '2.7vw',
  };
});
const awayTeamLogo = computed((): CSSProperties => {
  return {
    height: locator.awayTeam.logoSize + '%',
    maxHeight: '9.5vh',
    maxWidth: '11.9vw',
    position: 'relative',
  };
});
const homeTeamLogo = computed((): CSSProperties => {
  return {
    height: locator.homeTeam.logoSize + '%',
    maxHeight: '9.5vh',
    maxWidth: '11.9vw',
    position: 'relative',
  };
});
const awayTeamName = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    color: locator.awayTeam.nameColor || 'black',
    display: 'flex',
    flexWrap: 'nowrap',
    fontSize: locator.awayTeam.nameSize + 3.7 + 'vh',
    height: '5.55vh',
    justifyContent: 'center',
    left: '30.84vw',
    top: '79.26vh',
    width: '14vw',
  };
});
const homeTeamName = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    color: locator.homeTeam.nameColor || 'black',
    display: 'flex',
    flexWrap: 'nowrap',
    fontSize: locator.homeTeam.nameSize + 3.7 + 'vh',
    height: '5.55vh',
    justifyContent: 'center',
    left: '54.78vw',
    top: '79.26vh',
    width: '14vw',
  };
});
const location = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    color: 'pink',
    bottom: '10.9vh',
    display: 'flex',
    height: '3.97vh',
    fontSize: '3.6vh',
    justifyContent: 'center',
    left: '34.08vw',
    width: '32.875vw',
  };
});
</script>

<style scoped>
@font-face {
	font-family: "swiss721_heavy";
	src: url('~/assets/espn/Swiss721Heavy.ttf')
}
div {
	position: absolute;
	font-family: "swiss721_heavy";
}
.locator {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
}
</style>
