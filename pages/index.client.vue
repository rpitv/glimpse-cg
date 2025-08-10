<template>
  <div id="configuration-page">
    <Settings ref="settings" @update:config="schedule?.refresh()"/>
    <Schedule ref="schedule" @loadMatchup="setPresets" />
  </div>
</template>

<script lang="ts" setup>
import Schedule from '~/components/configuration/schedule.vue';
import Settings from '~/components/configuration/settings.vue';
import type { Configuration } from '~/types/replicants';
import schools from '~/assets/schools.json';

const schedule = useTemplateRef<InstanceType<typeof Schedule>>('schedule');
const settings = useTemplateRef<InstanceType<typeof Settings>>('settings');

function setPresets(teamConfig: Configuration['awayTeam' | 'homeTeam']) {
  settings.value?.awayTeamConfig?.loadPreset(teamConfig);
  settings.value?.homeTeamConfig?.loadPreset(schools[0]);
}

</script>

<style>
#configuration-page {
  display: grid;
  grid-template-columns: 7fr 4fr;
}
</style>