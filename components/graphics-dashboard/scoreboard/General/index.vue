<template>
  <div class="controller mt-5 pb-5">
    <div>
      <div class="flex justify-center">
        <TeamScore v-model="awayTeamScoreboard" :team="awayTeam" />
        <TeamScore v-model="homeTeamScoreboard" :team="homeTeam" />
      </div>
    </div>
    <div>
      <ClockControl />
      <PeriodControl />
    </div>
    <div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeamScore from './TeamScore.vue';
import ClockControl from './ClockControl.vue';
import PeriodControl from './PeriodControl.vue';

const replicants = await useReplicants();
const scoreboard = replicants.scoreboard;

const awayTeam = replicants.configuration.awayTeam;
const homeTeam = replicants.configuration.homeTeam;
const awayTeamScoreboard = scoreboard.awayTeam;
const homeTeamScoreboard = scoreboard.homeTeam;

</script>

<style scoped>
.controller {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 10px;
}
</style>