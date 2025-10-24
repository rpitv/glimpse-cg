<template>
  <div class="w-full text-center">
    <UCard class="rounded-none">
      <div :class="'flex justify-center items-center gap-4 ' + (team === 'homeTeam' ? 'flex-row-reverse' : '')">
        <div>
          <div>
            <u class="block text-[16px]">SHOTS ON GOAL</u>
            <UTooltip :disabled="!sync[team].hockey.sog" text="Controls cannot be edited when sync is enabled.">
              <UInputNumber class="w-[150px]" v-model="hockey[team].sog" variant="soft" :max="999" :min="0" :disabled="sync[team].hockey.sog"
                :ui="{
                  base: 'text-xl text-center min-w-[75px]',
                }"
              >
                <template #decrement>
                  <UButton variant="ghost" color="error">
                    <FontAwesomeIcon icon="fa-solid fa-minus" />
                  </UButton>
                </template>
                <template #increment>
                  <UButton variant="ghost">
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                  </UButton>
                </template>
              </UInputNumber>
            </UTooltip>
          </div>
          <div class="mt-4">
            <u class="block text-[16px]">FACEOFFS</u>
            <UTooltip :disabled="!sync[team].hockey.faceoff" text="Controls cannot be edited when sync is enabled.">
              <UInputNumber class="w-[150px]" v-model="hockey[team].faceoff" variant="soft" :max="999" :min="0" :disabled="sync[team].hockey.faceoff"
                :ui="{
                  base: 'text-xl text-center min-w-[75px]',
                }"
              >
                <template #decrement>
                  <UButton variant="ghost" color="error">
                    <FontAwesomeIcon icon="fa-solid fa-minus" />
                  </UButton>
                </template>
                <template #increment>
                  <UButton variant="ghost">
                    <FontAwesomeIcon icon="fa-solid fa-plus" />
                  </UButton>
                </template>
              </UInputNumber>
            </UTooltip>
          </div>
        </div>
        <div>
          <u class="block text-[20px]">SCORE</u>
          <UTooltip :disabled="!sync[team].score" text="Controls cannot be edited when sync is enabled.">            
            <UInputNumber class="w-[200px]" v-model="teamScoreboard!.score" variant="ghost" :max="999" :min="0" :disabled="sync[team].score"
              :ui="{
                base: 'text-5xl text-center min-w-[75px]',
              }"
            >
              <template #decrement>
                <UButton size="xl" variant="ghost" color="error">
                  <FontAwesomeIcon icon="fa-solid fa-minus" />
                </UButton>
              </template>
              <template #increment>
                <UButton size="xl" variant="ghost">
                  <FontAwesomeIcon icon="fa-solid fa-plus" />
                </UButton>
              </template>
            </UInputNumber>
          </UTooltip>
        </div>
      </div>
      <UModal
	      :ui="{
          content: 'max-w-3xl',
        }"
      >
        <UButton
          variant="link"
          class="text-gray-400 text-xl mt-2 group transition-all duration-200 relative"
        >
          <span class="relative flex items-center justify-center">
            <span>{{ teamScoreboard!.name || configuration[team].abbr }}</span>
            <span
              class="absolute left-full top-1/2 -translate-y-1/2 ml-2 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 pointer-events-none"
            >
              <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
            </span>
          </span>
        </UButton>
        <template #content>
          <UCard>
            <template #header>
              <p class="text-2xl">Edit <b>{{ teamScoreboard!.name || configuration[team].abbr }}</b> Visuals</p>
            </template>
            <template #default>
              <div class="flex justify-between">
                <div class="w-full">
                  <UFormField label="Team Name" help="The name of the team.">
                    <UInput v-model="teamScoreboard!.name" :placeholder="configuration[team].abbr" />
                  </UFormField>
                  <ColorPicker v-model="teamScoreboard!.nameColor" class="mt-4"  label="Team Name Color" help="The color for the team name" />
                  <UFormField class="mt-4" label="Team Name Size" help="Adjust the size of the team name.">
                    <UInputNumber v-model="teamScoreboard!.nameSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
                  </UFormField>
                  <UFormField class="mt-4" label="Team Logo" help="The logo of the team.">
                    <UInput v-model="teamScoreboard!.logo" class="w-full" :placeholder="configuration[team].logo" />
                  </UFormField>
                  <UFormField class="mt-4" label="Team Logo Size" help="Adjust the size of the team logo.">
                    <UInputNumber v-model="teamScoreboard!.logoSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
                  </UFormField>
                </div>
                <div class="w-full">
                  <ColorPicker v-model="teamScoreboard!.primaryColor" label="Primary Color" help="The primary color of the team." :placeholder="configuration[team].primaryColor"/>
                  <ColorPicker v-model="teamScoreboard!.secondaryColor" label="Secondary Color" help="The secondary color of the team." :placeholder="configuration[team].secondaryColor" />
                </div>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { Scoreboard } from '~/types/replicants';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const replicants = await useReplicants();
const configuration = replicants.configuration;
const hockey = replicants.scoreboard.hockey;
const sync = configuration.sync;

const teamScoreboard = defineModel<Scoreboard["homeTeam" | "awayTeam"]>();
defineProps<{
  team: "awayTeam" | "homeTeam",
}>();


</script>

<style>

</style>