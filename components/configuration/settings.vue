<template>
  <UCard class="rounded-none">
    <template #header>
      <h1 class="text-2xl">Settings</h1>
    </template>
    <template #default v-if="configuration">
      <div>
        <UFormField label="Graphic Style">
          <USelect :class="width" :items="styles" v-model="configuration.style" />
        </UFormField>
      </div>
      <USeparator orientation="horizontal" :class="height" />
      <div>
        <UFormField label="Sport">
          <USelect :class="width" :items="sports" v-model="configuration.sport" @update:model-value="$emit('update:config')" />
        </UFormField>
      </div>
      <USeparator v-if="configuration.sport !== 'acha' && configuration.sport !== 'football'" orientation="horizontal" :class="height" />
      <div v-if="configuration.sport !== 'acha' && configuration.sport !== 'football'">
        <UFormField label="Type (Important for Rosters)">
          <USelect :class="width" :items="type" v-model="configuration.type" @update:model-value="$emit('update:config')"/>
        </UFormField>
      </div>
      <USeparator orientation="horizontal" :class="height" />
      <div class="flex gap-5">
        <TeamConfig v-model="configuration.awayTeam" class="w-full" team-side="away" ref="awayTeamConfig" />
        <TeamConfig v-model="configuration.homeTeam" class="w-full" team-side="home" ref="homeTeamConfig" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import TeamConfig from './teamConfig.vue';
import type { Configuration } from '~/types/replicants';

const awayTeamConfig = useTemplateRef<InstanceType<typeof TeamConfig>>('awayTeamConfig');
const homeTeamConfig = useTemplateRef<InstanceType<typeof TeamConfig>>('homeTeamConfig');

const configuration = await useReplicant<Configuration>('configuration');
const width = 'w-48';
const height = 'h-5'

const styles = [{
  label: 'RPI TV',
  value: 'rpitv'
},
{
  label: 'ESPN',
  value: 'espn'
},
{
  label: 'Football',
  value: 'football'
}];

const sports = [{
  label: 'Hockey',
  value: 'hockey'
},
{
  label: 'ACHA',
  value: 'acha'
},
{
  label: 'Football',
  value: 'football'
},
{
  label: 'Basketball',
  value: 'basketball'
},
{
  label: 'Soccer',
  value: 'soccer'
}];

const type = [{
  label: 'Mens',
  value: 'men'
},
{
  label: 'Womens',
  value: 'women'
}];


const emit = defineEmits(['update:config'])
defineExpose({
  awayTeamConfig: awayTeamConfig,
  homeTeamConfig: homeTeamConfig
});

</script>

<style>

</style>