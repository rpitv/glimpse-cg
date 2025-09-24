<template>
  <div class="controller mt-5 pb-5">
    <div class="flex justify-center">
      <TeamScore v-model="awayTeamScoreboard" :team="awayTeam" />
      <TeamScore v-model="homeTeamScoreboard" :team="homeTeam" />
    </div>
    <div>
      <UCard class="rounded-none">
        <template #header>
          <p class="text-2xl">Time Control</p>
        </template>
        <template #default>
          <p class="text-center text-5xl">{{ formattedClockTime }}</p>
          <UButtonGroup >
            <UButton variant="outline" @click="clock.time = Math.max(0, clock.time - 1000)">-1s</UButton>
            <UButton variant="outline" @click="clock.time = Math.max(0, clock.time - 100)">-0.1s</UButton>
            <UButton variant="outline" @click="clock.isRunning = !clock.isRunning">{{ clock.isRunning ? 'Pause' : 'Start' }}</UButton>
            <UButton variant="outline" @click="clock.time += 100">+0.1s</UButton>
            <UButton variant="outline" @click="clock.time += 1000">+1s</UButton>
            <UButton variant="outline" color="secondary" @click="clock.time = 0; clock.isRunning = false">Reset</UButton>
            <!-- <UButton color="secondary" @click="period += 1">+Period ({{ period }})</UButton> -->
            <!-- <UButton color="secondary" @click="if (period > 1) period -= 1">-Period ({{ period }})</UButton> -->
          </UButtonGroup>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeamScore from './TeamScore.vue';

const replicants = await useReplicants();
const scoreboard = replicants.scoreboard;

const awayTeam = replicants.configuration.awayTeam;
const homeTeam = replicants.configuration.homeTeam;
const awayTeamScoreboard = scoreboard.awayTeam;
const homeTeamScoreboard = scoreboard.homeTeam;

const clock = scoreboard.clock;
const period = scoreboard.period;
const formattedClockTime = computed<string>(() => {
	const minutes = Math.floor(clock.time / 60000).toString();
	let seconds = Math.floor((clock.time % 60000) / 1000).toString();
	const millis = Math.floor((clock.time % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
});
</script>

<style scoped>
.controller {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 10px;
}
</style>