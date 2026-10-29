<template>
  <div>
    <svg
      version="1.2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3840 2160"
      class="fullscreen"
    >
      <defs>
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
        id="Locater BG"
        fill-rule="evenodd"
        class="s0"
        d="m1471 1279h897c5.52 0 10 4.48 10 10v753c0 5.52-4.48 10-10 10h-897c-5.52 0-10-4.48-10-10v-753c0-5.52 4.48-10 10-10z"
      />
      <g id="Location">
        <path
          id="Location BG"
          fill-rule="evenodd"
          class="s1"
          d="m1547.61 1845.81h745.51c15.47 0 28 12.54 28 28v101.15c0 15.46-12.53 28-28 28h-745.51c-15.47 0-28-12.54-28-28v-101.15c0-15.46 12.53-28 28-28z"
        />
        <text
          id="Location"
          style="transform: matrix(1.109, 0, 0, 1.109, 1766.16, 1963.967)"
        >
          <tspan x="0" y="0" class="t2">Troy, New York</tspan>
        </text>
        <text
          id="Venue Name"
          style="transform: matrix(1.109, 0, 0, 1.109, 1690.321, 1911.087)"
        >
          <tspan :style="locationStyle" text-anchor="middle" x="205" y="0" class="t3">{{ locator.location.name || 'Houston Field House' }}</tspan>
        </text>
      </g>
      <g id="Home">
        <path
          id="Color bg"
          fill-rule="evenodd"
          class="s4"
          :style="`fill: ${locator.homeTeam.primaryColor || homeTeam.primaryColor || '#858585'}`"
          d="m1990 1440h346c5.52 0 10 4.48 10 10v366c0 5.52-4.48 10-10 10h-346c-5.52 0-10-4.48-10-10v-366c0-5.52 4.48-10 10-10z"
        />
        <path
          id="Rectangle Border"
          fill-rule="evenodd"
          class="s5"
          d="m1980.29 1440.05h365.83v385.8h-365.83z"
        />
        <text
          id="HOME SCHOOL NAME"
          style="transform: matrix(1.109, 0, 0, 1.109, 2090.178, 1797.753)"
        >
          <tspan :style="homeTeamStyle" text-anchor="middle" x="65" y="0" class="t6">{{ locator.homeTeam.name || homeTeam.shortName || 'Home' }}</tspan>
        </text>
        <use id="Home School Logo" href="#img2" x="2010" y="1470" />
      </g>
      <g id="AWAY - LEFT">
        <path
          id="Away Color BG"
          fill-rule="evenodd"
          class="s4"
          :style="`fill: ${locator.awayTeam.primaryColor || awayTeam.primaryColor || '#858585'}`"
          d="m1505 1440h346c5.52 0 10 4.48 10 10v366c0 5.52-4.48 10-10 10h-346c-5.52 0-10-4.48-10-10v-366c0-5.52 4.48-10 10-10z"
        />
        <path
          id="Rectangle Border"
          fill-rule="evenodd"
          class="s5"
          d="m1495.02 1440.05h365.84v385.8h-365.84z"
        />
        <text
          id="AWAY SCHOOL NAME"
          style="transform: matrix(1.109, 0, 0, 1.109, 1610.878, 1794.778)"
        >
          <tspan :style="awayTeamStyle" text-anchor="middle" x="60" y="0" class="t6">{{ locator.awayTeam.name || awayTeam.shortName || 'Away' }}</tspan>
        </text>
        <use id="Away School Logo" href="#img3" x="1531" y="1470" />
      </g>
      <g id="ECAC &amp; SNY">
        <use
          id="SNY_LOGO_BLUE"
          href="#img4"
          transform="matrix(.017,0,0,.017,2010,1300)"
        />
        <use
          id="ECAC Primary Logo"
          href="#img5"
          transform="matrix(.195,0,0,.196,1489.953,1300)"
        />
      </g>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';

const replicants = await useReplicants();
const locator = replicants.lowerThird.locator;
const homeTeam = replicants.configuration.homeTeam;
const awayTeam = replicants.configuration.awayTeam;

const locationStyle = computed((): CSSProperties => {
  return {
    fill: locator.location.nameColor || '#d6001c',
    fontSize: locator.location.nameSize + 3 + 'em'
  };
});

const homeTeamStyle = computed((): CSSProperties => {
  return {
    fill: locator.homeTeam.nameColor || '#FFFFFF',
    fontSize: locator.homeTeam.nameSize + 3 + 'em'
  };
});

const awayTeamStyle = computed((): CSSProperties => {
  return {
    fill: locator.awayTeam.nameColor || '#FFFFFF',
    fontSize: locator.awayTeam.nameSize + 3 + 'em'
  };
});

</script>

<style scoped>
.fullscreen {
  position: absolute;
  height: 100vh;
  width: 100vw;
}
tspan {
  white-space: pre;
}
.s0 {
  fill: #ffffff;
  stroke: #adadad;
  paint-order: stroke fill markers;
  stroke-linejoin: round;
  stroke-width: 58;
}
.s1 {
  fill: #000000;
}
.t2 {
  font-size: 42px;
  fill: #ffffff;
  font-weight: 300;
  font-family: "Rubik-Regular", "Rubik";
}
.t3 {
  font-size: 48px;
  fill: #ee3124;
  font-family: "Rubik-Regular", "Rubik";
}
.s4 {
  fill: #858585;
}
.s5 {
  fill: none;
  stroke: #000000;
  stroke-miterlimit: 100;
  stroke-width: 7;
}
.t6 {
  font-size: 48px;
  fill: #ffffff;
  font-weight: 300;
  font-family: "Rubik-Regular", "Rubik";
}
</style>
