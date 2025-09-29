<template>
  <div class="w-full text-center">
    <UCard class="rounded-none">
      <div class="flex justify-center items-center gap-4">
        <p class="text-5xl">{{ teamScoreboard!.score }}</p>
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
            <span>{{ teamScoreboard!.name || team.abbr }}</span>
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
              <p class="text-2xl">Edit <b>{{ teamScoreboard!.name || team.abbr }}</b> Visuals</p>
            </template>
            <template #default>
              <div class="flex justify-between">
                <div class="w-full">
                  <UFormField label="Team Name" help="The name of the team.">
                    <UInput v-model="teamScoreboard!.name" :placeholder="team.shortName" />
                  </UFormField>
                  <ColorPicker v-model="teamScoreboard!.nameColor" class="mt-4"  label="Team Name Color" help="The color for the team name" />
                  <UFormField class="mt-4" label="Team Name Size" help="Adjust the size of the team name.">
                    <UInputNumber v-model="teamScoreboard!.nameSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
                  </UFormField>
                  <UFormField class="mt-4" label="Team Logo" help="The logo of the team.">
                    <UInput v-model="teamScoreboard!.logo" class="w-full" :placeholder="team.logo" />
                  </UFormField>
                  <UFormField class="mt-4" label="Team Logo Size" help="Adjust the size of the team logo.">
                    <UInputNumber v-model="teamScoreboard!.logoSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
                  </UFormField>
                </div>
                <div class="w-full">
                  <ColorPicker v-model="teamScoreboard!.primaryColor" label="Primary Color" help="The primary color of the team." :placeholder="team.primaryColor"/>
                  <ColorPicker v-model="teamScoreboard!.secondaryColor" label="Secondary Color" help="The secondary color of the team." :placeholder="team.secondaryColor" />
                </div>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </UCard>
    <UCard class="rounded-none">
      <template #footer>
        <UInputNumber v-model="teamScoreboard!.score" size="xl" />
      </template>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { Scoreboard, Configuration } from '~/types/replicants';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const teamScoreboard = defineModel<Scoreboard["homeTeam" | "awayTeam"]>();
defineProps<{
  team: Configuration["homeTeam" | "awayTeam"]
}>();

</script>

<style>

</style>