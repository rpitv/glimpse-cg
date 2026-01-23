<template>
  <div class="controller mt-5 pb-5">
    <div>
      <UCard class="rounded-none">
        <template #header>
          <b class="text-2xl">Scoreboard Control</b>
          <div class="flex items-center gap-2 mt-2">
            <USwitch
              v-model="channels[0]!.scoreboard"
              size="xl"
              label="Display Scorebug"
            />
            <UKbd :class="`${inputFocus.isInputFocused.value ? 'opacity-20' : 'opacity-100'} transition-all`">
              SPACE
            </UKbd>
          </div>
        </template>
      </UCard>
      <div class="flex justify-center">
        <TeamScore
          team="awayTeam"
        />
        <TeamScore
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
            <Info class="text-xl">SOG will automatically be turned off if the scorebug is turned off.</Info>
            <UKbd :class="`${inputFocus.isInputFocused.value ? 'opacity-20' : 'opacity-100'} transition-all`">
              G
            </UKbd>
          </div>
          <!-- <div class="flex items-center gap-2 mt-2">
            <USwitch
              v-model="replicants.channels[0]!.faceoff"
              size="xl"
              label="Display Faceoffs"
            />
            <UKbd v-if="!inputFocus.isInputFocused.value">F</UKbd>
          </div> -->
        </template>
      </UCard>
      <UCard class="rounded-none mt-8">
        <template #header>
          <b class="text-2xl">Announcement Control
            <Info>
              Annoncements can be rearranged by dragging and dropping the rows.<br>
              The first announcement in the table will be displayed first.
            </Info>
          </b>
        </template>
        <div class="grid grid-cols-2 gap-4 mt-4">
          <AnnouncemntSection
            section="awayTeam"
            name="Away"
          />
          <AnnouncemntSection
            section="homeTeam"
            name="Home"
          />
          <AnnouncemntSection
            class="mt-4"
            section="global"
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
const channels = replicants.channels;


defineShortcuts({
  ' ': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.scoreboard = !channels[0]?.scoreboard;
  },
  'g': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.sog = !channels[0]?.sog;
  },
  // 'f': () => {
  //   if (!inputFocus.isInputFocused.value) channels[0]!.faceoff = !channels[0]?.faceoff;
  // },
  's': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.shootout = !channels[0]?.shootout;
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
