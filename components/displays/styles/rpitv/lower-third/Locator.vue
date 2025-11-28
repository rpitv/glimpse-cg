<template>
  <img
    class="locator"
    :src="Locator"
  >
  <div :style="homeTeamPrimaryColor">
    <img
      :style="homeTeamLogo"
      :src="locator.homeTeam.logo || homeTeam.logo"
      :alt="homeTeam.schoolName"
    >
    <div :style="homeTeamName">
      {{ locator.homeTeam.name || homeTeam.shortName }}
    </div>
  </div>
  <div :style="awayTeamPrimaryColor">
    <img
      :style="awayTeamLogo"
      :src="locator.awayTeam.logo || awayTeam.logo"
      :alt="awayTeam.schoolName"
    >
    <div :style="awayTeamName">
      {{ locator.awayTeam.name || awayTeam.shortName }}
    </div>
  </div>
  <div :style="location">
    {{ locator.location.name || "Houston Field House" }}
  </div>
</template>

<script setup lang="ts">
import Locator from '~/assets/rpitv-modern/Locator.png';
import type { CSSProperties } from 'vue';

// background color of the gray in use rgb(133,133,133);
const replicants = await useReplicants();
const locator = replicants.lowerThird.locator;
const homeTeam = replicants.configuration.homeTeam;
const awayTeam = replicants.configuration.awayTeam;

const homeTeamPrimaryColor = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    backgroundColor: locator.homeTeam.primaryColor || homeTeam.primaryColor,
    bottom: '15.7vh',
    display: 'flex',
    height: '17.4vh',
    flexDirection: 'column',
    justifyContent: 'space-between',
    left: '39.1vw',
    width: '9.2vw',
  };
});
const awayTeamPrimaryColor = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    backgroundColor: locator.awayTeam.primaryColor || awayTeam.primaryColor,
    bottom: '15.7vh',
    display: 'flex',
    height: '17.4vh',
    flexDirection: 'column',
    justifyContent: 'space-between',
    left: '51.7vw',
    width: '9.2vw',
  };
});
const homeTeamLogo = computed((): CSSProperties => {
  return {
    height: locator.homeTeam.logoSize + '%',
    maxHeight: '12.3vh',
  };
});
const awayTeamLogo = computed((): CSSProperties => {
  return {
    height: locator.awayTeam.logoSize + '%',
    maxHeight: '12.3vh',
  };
});
const homeTeamName = computed((): CSSProperties => {
  return {
    color: locator.homeTeam.nameColor || 'black',
    fontSize: locator.homeTeam.nameSize + 1.7 + 'vw',
    position: 'relative',
    textAlign: 'center',
  };
});
const awayTeamName = computed((): CSSProperties => {
  return {
    color: locator.awayTeam.nameColor || 'black',
    fontSize: locator.awayTeam.nameSize + 1.7 + 'vw',
    position: 'relative',
    textAlign: 'center',
  };
});
const location = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    backgroundColor: 'black',
    color: locator.location.nameColor || '#d6001c',
    bottom: '10.7vh',
    display: 'flex',
    fontSize: locator.location.nameSize + 2.5 + 'vh',
    fontWeight: 'bolder',
    justifyContent: 'center',
    left: '40vw',
    width: '20.1vw',
  };
});
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
