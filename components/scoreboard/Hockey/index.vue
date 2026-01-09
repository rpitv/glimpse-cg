<template>
  <div class="controller mt-5 pb-5">
    <div>
      <UCard class="rounded-none">
        <template #header>
          <h1 class="text-2xl">Scoreboard Control</h1>
          <div class="flex items-center gap-2 mt-2">
            <USwitch
              v-model="channels[0]!.scoreboard"
              size="xl"
              label="Display Scorebug"
            />
            <UKbd v-if="!inputFocus.isInputFocused.value">SPACE</UKbd>
          </div>
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
          <div class="flex items-center gap-2">
            <USwitch
              v-model="replicants.channels[0]!.sog"
              size="xl"
              label="Display SOG"
            />
            <UKbd v-if="!inputFocus.isInputFocused.value">G</UKbd>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <USwitch
              v-model="replicants.channels[0]!.faceoff"
              size="xl"
              label="Display Faceoffs"
            />
            <UKbd v-if="!inputFocus.isInputFocused.value">F</UKbd>
          </div>
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
const inputFocus = useInputFocus();
const scoreboard = replicants.scoreboard;
const channels = replicants.channels;

const awayTeamScoreboard = scoreboard.awayTeam;
const homeTeamScoreboard = scoreboard.homeTeam;

defineShortcuts({
  ' ': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.scoreboard = !channels[0]?.scoreboard;
  },
  'g': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.sog = !channels[0]?.sog;
  },
  'f': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.faceoff = !channels[0]?.faceoff;
  },
})
</script>

<style scoped>
.controller {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 10px;
}
</style>
