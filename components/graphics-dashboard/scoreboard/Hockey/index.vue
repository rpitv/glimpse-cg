<template>
  <div class="controller mt-5 pb-5">
    <div>
      <UCard class="rounded-none">
        <template #header>
          <USwitch
            v-model="channels[0]!.scoreboard"
            label="Scorebug Control"
            size="xl"
            :ui="{
              label: 'text-2xl',
            }"
            description="Turn on or off the scorebug"
          />
        </template>
      </UCard>
      <div class="flex justify-center">
        <TeamScore
          v-model="awayTeamScoreboard"
          team="awayTeam"
        />
        <TeamScore
          v-model="homeTeamScoreboard"
          team="homeTeam"
        />
      </div>
      <UCard class="rounded-none">
        <template #footer>
          <USwitch
            v-model="replicants.channels[0]!.sog"
            size="xl"
            label="Display SOG"
          />
          <USwitch
            v-model="replicants.channels[0]!.faceoff"
            class="mt-4"
            size="xl"
            label="Display Faceoffs"
          />
        </template>
      </UCard>
      <UCard class="rounded-none mt-8">
        <template #header>
          <b class="text-2xl">Announcement Control</b>
        </template>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <AnnouncemntSection
            :section="replicants.scoreboard.awayTeam"
            name="Away"
          />
          <AnnouncemntSection
            :section="replicants.scoreboard.homeTeam"
            name="Home"
          />
          <AnnouncemntSection
            class="mt-4"
            :section="replicants.scoreboard"
            name="Global"
          />
        </div>
      </UCard>
    </div>
    <div>
      <ClockControl />
      <PeriodControl class="mt-8" />
      <ShootoutControl class="mt-8" />
    </div>
    <div />
  </div>
</template>

<script setup lang="ts">
import AnnouncemntSection from '../General/AnnouncemntSection.vue';
import ClockControl from '../General/ClockControl.vue';
import PeriodControl from '../General/PeriodControl.vue';
import ShootoutControl from './ShootoutControl.vue';
import TeamScore from './TeamScore.vue';

const replicants = await useReplicants();
const scoreboard = replicants.scoreboard;
const channels = replicants.channels;

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
