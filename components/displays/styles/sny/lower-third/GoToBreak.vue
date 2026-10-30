<template>
  <div>
    <svg
      class="fullscreen"
      preserveAspectRatio="xMidYMid meet"
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3840 2160"
      style="z-index: -1"
    >
      <defs>
        <image
          width="293"
          height="273"
          id="img2"
          :href="goToBreak.homeTeam.logo || homeTeam.logo"
        />
        <image
          width="293"
          height="273"
          id="img3"
          :href="goToBreak.awayTeam.logo || awayTeam.logo"
        />
        <image
          width="18284"
          height="6948"
          id="img4"
          href="/assets/sny/SNY_logo.png"
        />
        <image
          width="1924"
          height="592"
          id="img5"
          href="/assets/sny/ecac_hockey.svg"
        />
      </defs>
        <path
            id="BACKGROUND RECTANGLE"
            fill-rule="evenodd"
            class="s0"
            d="m970 1350h1900c5.52 0 10 4.48 10 10v600c0 5.52-4.48 10-10 10h-1900c-5.52 0-10-4.48-10-10v-600c0-5.52 4.48-10 10-10z"
        />
      <g id="HOME - RIGHT" style="transform: translateX(100px);">
        <path
          id="HOME SCHOOL COLOR BG"
          fill-rule="evenodd"
          class="s1"
          :style="`fill: ${goToBreak.homeTeam.primaryColor || homeTeam.primaryColor || '#858585'}`"
          d="m2377 1421h346c5.52 0 10 4.48 10 10v366c0 5.52-4.48 10-10 10h-346c-5.52 0-10-4.48-10-10v-366c0-5.52 4.48-10 10-10z"
        />
        <path
          id="Rectangle Border"
          fill-rule="evenodd"
          class="s2"
          d="m2367.29 1421.05h365.83v385.8h-365.83z"
        />
        <text
          id="Home School Mascot Name"
          style="transform: matrix(1.109, 0, 0, 1.109, 2483.581, 1780.526)"
        >
          <tspan :style="homeTeamName" text-anchor="middle" x="60" y="0" class="t3">
            {{ goToBreak.homeTeam.name || homeTeam.teamName }}
          </tspan>
        </text>
        <use id="Home - School Logo" href="#img2" x="2396" y="1457" />
      </g>
      <g id="Away - Left" style="transform: translateX(-100px);">
        <path
          :style="`fill: ${goToBreak.awayTeam.primaryColor || awayTeam.primaryColor || '#858585'}`"
          id="AWAY SCHOOL COLOR BG"
          fill-rule="evenodd"
          class="s1"
          d="m1117 1421h346c5.52 0 10 4.48 10 10v366c0 5.52-4.48 10-10 10h-346c-5.52 0-10-4.48-10-10v-366c0-5.52 4.48-10 10-10z"
        />
        <path
          id="Rectangle Border"
          fill-rule="evenodd"
          class="s2"
          d="m1107.02 1421.05h365.84v385.8h-365.84z"
        />
        <text
          id="Away School Mascot Name"
          style="transform: matrix(1.122, 0, 0, 1.122, 1222.563, 1783.783)"
        >
          <tspan :style="awayTeamName" text-anchor="middle" x="60" y="0" class="t3">
            {{ goToBreak.awayTeam.name || awayTeam.teamName }}
          </tspan>
        </text>
        <use id="Away - School Logo" href="#img3" x="1143" y="1465" />
      </g>
      <g id="Score Box">

          <path
              id="Score Box"
              fill-rule="evenodd"
              class="s4"
              d="m1420 1421h1000v386h-1000z"
          />
        <text
          id="Away Score"
          style="transform: matrix(5.637, 0, 0, 5.637, 1590, 1709.835)"
        >
          <tspan text-anchor="middle" x="0" y="0" class="t3">{{ scoreboard.awayTeam.score }}</tspan>
        </text>
        <text
          id="Home Score"
          style="transform: matrix(5.637, 0, 0, 5.637, 2090, 1709.835)"
        >
          <tspan text-anchor="middle" x="30" y="0" class="t3">{{ scoreboard.homeTeam.score }}</tspan>
        </text>
        <path
          id="Description Box"
          fill-rule="evenodd"
          class="s4"
          d="m1632 1832.27h576v86h-576z"
        />
        <text id="Description" transform="translate(1661.8,1889.2)">
          <tspan text-anchor="middle" x="265" y="0"  class="t3">{{ goToBreak.description.text }} {{ goToBreak.description.clock && clock.time ? `(${formattedClockTime})` : '' }}</tspan>
        </text>
      </g>
    </svg>
    <SNYBug class="bug" />
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import SNYBug from './Bug.vue';

const replicants = await useReplicants();
const goToBreak = replicants.lowerThird.goToBreak;
const scoreboard = replicants.scoreboard;
const clock = replicants.scoreboard.clock;
const homeTeam = replicants.configuration.homeTeam;
const awayTeam = replicants.configuration.awayTeam;

const formattedClockTime = computed<string>(() => {
  const minutes = Math.floor(clock.time / 60000).toString();
  let seconds = Math.floor((clock.time % 60000) / 1000).toString();
  const millis = Math.floor((clock.time % 1000) / 100).toString();
  if (minutes === '0') {
    return `${seconds}.${millis}`;
  }
  else {
    // noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
    seconds = seconds.padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
});

// NOTE: In this SVG, the SVG itself is scaled to use viewports. Anything inside it will scale alongside it.
// As such, we will be using non viewport units for this to work.
const homeTeamName = computed((): CSSProperties => {
  return {
    fill: goToBreak.homeTeam.nameColor || 'white',
    fontSize: goToBreak.homeTeam.nameSize + 3 + 'em',
  };
});

const awayTeamName = computed((): CSSProperties => {
  return {
    fill: goToBreak.awayTeam.nameColor || 'white',
    fontSize: goToBreak.awayTeam.nameSize + 3 + 'em',
  };
});
</script>

<style scoped>
.bug {
  position: absolute;
  width: 17vw;
  top: 62.5vh;
  left: 41.6vw;
}

.fullscreen {
  width: 100vw;
  height: 100vh;
}

tspan {
  white-space: pre;
}
.s0 {
  fill: #ffffff;
  stroke: #adadad;
  stroke-linejoin: round;
  stroke-width: 43;
}
.s2 {
  fill: none;
  stroke: #000000;
  stroke-miterlimit: 100;
  stroke-width: 7;
}
.t3 {
  font-size: 48px;
  fill: #ffffff;
  font-weight: 300;
  font-family: "Rubik-Regular", "Rubik";
}
.s4 {
  fill: #858585;
  stroke: #000000;
  stroke-miterlimit: 100;
  stroke-width: 7;
}
.s5 {
  fill: #000000;
  stroke: #000000;
  stroke-miterlimit: 100;
  stroke-width: 7;
}

#Description {
  text-align: center;
}
</style>