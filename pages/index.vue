<template>
  <div id="configuration-page">
    <UCard class="rounded-none">
      <template #header>
        <h1 class="text-2xl">
          Settings
        </h1>
      </template>
      <template
        v-if="configuration"
        #default
      >
        <div class="flex justify-between">
          <div>
            <UFormField label="Graphic Style">
              <USelect
                v-model="configuration.style"
                :class="width"
                :items="styles"
              />
            </UFormField>
            <UFormField
              class="mt-4"
              label="Sport"
            >
              <USelect
                v-model="configuration.sport"
                :class="width"
                :items="sports"
                @update:model-value="scheduleCard!.refresh()"
              />
            </UFormField>
            <div v-if="configuration.sport !== 'acha' && configuration.sport !== 'football'">
              <UFormField
                class="mt-4"
                label="Type (Important for Rosters)"
              >
                <USelect
                  v-model="configuration.type"
                  :class="width"
                  :items="type"
                  @update:model-value="scheduleCard!.refresh()"
                />
              </UFormField>
            </div>
          </div>
          <div class="flex flex-col">
            <UFormField class="text-right">
              <template #help>
                <p>Resets the state of the scoreboard. <br>Useful when prepping for a new game.</p>
              </template>
              <UModal
                :close="true"
                :ui="{
                  footer: 'justify-end'
                }"
              >
                <UButton color="error">
                  <FontAwesomeIcon icon="fas fa-explosion" />
                  Reset Scoreboard
                </UButton>
                <template #header>
                  <p class="text-2xl font-bold">Reset Scoreboard</p>
                </template>
                <template #body>
                  <p class="text-lg font-bold mb-4">Are you sure you want to reset the scoreboard?</p>
                  <p class="text-muted">This will reset everything except the team configurations.</p>
                </template>
                <template #footer>
                  <UButton
                    color="error"
                    @click="resetScoreboard"
                  >
                    Reset Scoreboard
                  </UButton>
                </template>
              </UModal>
            </UFormField>
            <div class="flex justify-end mt-4">
              <UCheckbox label="Reset scoreboard on startup" size="xl" v-model="configuration.startup.resetScoreboard">
              </UCheckbox>
            </div>
          </div>
        </div>
        <div class="mt-8 flex gap-5">
          <TeamConfig
            class="w-full"
            team-side="awayTeam"
            @load-preset="loadPreset"
          />
          <TeamConfig
            class="w-full"
            team-side="homeTeam"
            @load-preset="loadPreset"
          />
        </div>
      </template>
    </UCard>
    <ScheduleCard ref="scheduleCard" :configuration="configuration" @load-matchup="loadMatchup"  />
  </div>
</template>

<script lang="ts" setup>
import type { Configuration } from '~/types/replicants';
import schools from '~/assets/schools.json';
import TeamConfig from '~/components/configuration/teamConfig.vue';
import ScheduleCard from '~/components/configuration/ScheduleCard.vue';

const toast = useToast();
const replicants = await useReplicants();
const configuration = replicants.configuration;
const locator = replicants.lowerThird.locator;
const goToBreak = replicants.lowerThird.goToBreak;
const scoreboard = replicants.scoreboard;
const scheduleCard = useTemplateRef<typeof ScheduleCard>('scheduleCard');
const width = 'w-48';

const styles = [{
  label: 'RPI TV',
  value: 'rpitv',
},
{
  label: 'ESPN',
  value: 'espn',
},
{
  label: 'Football',
  value: 'football',
}];

const sports = [{
  label: 'Hockey',
  value: 'hockey',
},
{
  label: 'ACHA',
  value: 'acha',
},
{
  label: 'Football',
  value: 'football',
},
{
  label: 'Basketball',
  value: 'basketball',
},
{
  label: 'Soccer',
  value: 'soccer',
}];

const type = [{
  label: 'Mens',
  value: 'men',
},
{
  label: 'Womens',
  value: 'women',
}];

function loadMatchup(teamConfig: Configuration['awayTeam' | 'homeTeam']) {
  loadPreset('awayTeam', teamConfig);
  loadPreset('homeTeam', schools[0]!);
}

function loadPreset(teamSide: 'awayTeam' | 'homeTeam', school: Configuration['awayTeam' | 'homeTeam']) {
  // Avoid unnecessary updates
  console.log(JSON.stringify(configuration[teamSide]), "\n\n", JSON.stringify(school));
  if (JSON.stringify(configuration[teamSide]) === JSON.stringify(school)) {
    return;
  }

  // Reset locator, gotobreak, and scoreboard for the team
  locator[teamSide].logo = '';
  locator[teamSide].logoColor = '';
  locator[teamSide].logoSize = 100;
  locator[teamSide].name = '';
  locator[teamSide].nameColor = '';
  locator[teamSide].nameSize = 0;
  locator[teamSide].primaryColor = '';
  locator[teamSide].secondaryColor = '';

  goToBreak[teamSide].logo = '';
  goToBreak[teamSide].logoColor = '';
  goToBreak[teamSide].logoSize = 100;
  goToBreak[teamSide].name = '';
  goToBreak[teamSide].nameColor = '';
  goToBreak[teamSide].nameSize = 0;
  goToBreak[teamSide].primaryColor = '';
  goToBreak[teamSide].secondaryColor = '';
  goToBreak[teamSide].scoreColor = '';
  goToBreak[teamSide].scoreSize = 0;

  scoreboard[teamSide].logo = '';
  scoreboard[teamSide].logoSize = 100;
  scoreboard[teamSide].name = '';
  scoreboard[teamSide].nameSize = 0;
  scoreboard[teamSide].primaryColor = '';
  scoreboard[teamSide].secondaryColor = '';
  scoreboard[teamSide].scoreColor = '';
  scoreboard[teamSide].scoreSize = 0;

  configuration[teamSide].abbr = school.abbr;
  configuration[teamSide].schoolName = school.schoolName;
  configuration[teamSide].shortName = school.shortName;
  configuration[teamSide].teamName = school.teamName;
  configuration[teamSide].logo = school.logo;
  configuration[teamSide].primaryColor = school.primaryColor;
  configuration[teamSide].secondaryColor = school.secondaryColor;
  configuration[teamSide].athletics = school.athletics;

  toast.add({
    title: 'Preset Loaded',
    description: `Loaded preset for ${school.schoolName}`,
    duration: 3000,
  });
}

async function resetScoreboard() {
  await useFetch('/api/resetScoreboard', {
    method: 'POST',
  }).then(() => {
    toast.add({
      title: 'Scoreboard Reset',
      description: 'The scoreboard has been reset successfully.',
      duration: 3000,
    });
  }).catch(() => {
    toast.add({
      title: 'Error',
      description: 'There was an error resetting the scoreboard.',
      duration: 3000,
      color: 'error',
    });
  });
}
</script>

<style>
#configuration-page {
  display: grid;
  grid-template-columns: 7fr 4fr;
}
</style>
