<template>
  <div class="controller mt-5 pb-5">
    <div>
      <UCard class="rounded-none">
        <template #header>
          <b class="text-2xl">Scoreboard Control</b>
        </template>
      </UCard>
      <div class="flex justify-center">
        <TeamScore v-model="awayTeamScoreboard" :team="awayTeam" />
        <TeamScore v-model="homeTeamScoreboard" :team="homeTeam" />
      </div>
      <UCard class="rounded-none mt-8">
        <template #header>
          <b class="text-2xl">Announcement Control</b>
        </template>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <AnnouncementSection :section="replicants.scoreboard.awayTeam" name="Away" />
          <AnnouncementSection :section="replicants.scoreboard.homeTeam" name="Home" />
          <AnnouncementSection class="mt-4" :section="replicants.scoreboard" name="Global"/>
        </div>
      </UCard>

    </div>
    <div>
      <ClockControl />
      <PeriodControl class="mt-8"/>
    </div>
    <div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TeamScore from './TeamScore.vue';
import ClockControl from './ClockControl.vue';
import PeriodControl from './PeriodControl.vue';
import AnnouncementSection from './AnnouncemntSection.vue';

const replicants = await useReplicants();
const scoreboard = replicants.scoreboard;

const awayTeam = replicants.configuration.awayTeam;
const homeTeam = replicants.configuration.homeTeam;
const awayTeamScoreboard = scoreboard.awayTeam;
const homeTeamScoreboard = scoreboard.homeTeam;




</script>

<style scoped>

:root {
  --ui-border: #ffffff !important;
}

.controller {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 10px;
}
</style>