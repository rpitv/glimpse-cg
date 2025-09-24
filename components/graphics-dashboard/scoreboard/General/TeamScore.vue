<template>
  <div class="w-full text-center">
    <UCard class="rounded-none">
      <div class="flex justify-center items-center gap-4">
        <p class="text-5xl">{{ teamScoreboard!.score }}</p>
      </div>
      <UModal :ui="{
        content: 'max-w-3xl',
      }">
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
                    <DebouncedInput v-model="teamScoreboard!.name" :placeholder="team.shortName" />
                  </UFormField>
                  <UFormField class="mt-4" label="Team Name Color" help="The color for the team name.">
                    <DebouncedInput v-model="teamScoreboard!.nameColor" placeholder="Currently Default">
                      <template #leading>
                        <UPopover>
                          <span :style="`background-color: ${teamScoreboard!.nameColor}; border: 1px solid;`" class="size-5 rounded-full" />
                          <template #content>
                            <UColorPicker :throttle="500" v-model="teamScoreboard!.nameColor" />
                          </template>
                        </UPopover>
                      </template>
                    </DebouncedInput>
                  </UFormField>
                  <UFormField class="mt-4" label="Team Name Size" help="Adjust the size of the team name.">
                    <DebouncedInputNumber v-model="teamScoreboard!.nameSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
                  </UFormField>
                  <UFormField class="mt-4" label="Team Logo" help="The logo of the team.">
                    <DebouncedInput class="w-full" v-model="teamScoreboard!.logo" :placeholder="team.logo" />
                  </UFormField>
                  <UFormField class="mt-4" label="Team Logo Size" help="Adjust the size of the team logo.">
                    <DebouncedInputNumber v-model="teamScoreboard!.logoSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
                  </UFormField>
                </div>
                <div class="w-full">
                  <UFormField label="Primary Color" help="The primary color of the team.">
                    <DebouncedInput v-model="teamScoreboard!.primaryColor" :placeholder="team.primaryColor">
                      <template #leading>
                        <UPopover>
                          <span :style="`background-color: ${teamScoreboard!.primaryColor}; border: 1px solid;`" class="size-5 rounded-full" />
                          <template #content>
                            <UColorPicker :throttle="500" v-model="teamScoreboard!.primaryColor" />
                          </template>
                        </UPopover>
                      </template>
                    </DebouncedInput>
                  </UFormField>
                  <UFormField class="mt-4" label="Secondary Color" help="The secondary color of the team.">
                    <DebouncedInput v-model="teamScoreboard!.secondaryColor" :placeholder="team.secondaryColor">
                      <template #leading>
                        <UPopover>
                          <span :style="`background-color: ${teamScoreboard!.secondaryColor}; border: 1px solid;`" class="size-5 rounded-full" />
                          <template #content>
                            <UColorPicker :throttle="500" v-model="teamScoreboard!.secondaryColor" />
                          </template>
                        </UPopover>
                      </template>
                    </DebouncedInput>
                  </UFormField>
                </div>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
    </UCard>
    <UCard class="rounded-none">
      <template #footer>
        <DebouncedInputNumber size="xl" v-model="teamScoreboard!.score"></DebouncedInputNumber>
      </template>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { Scoreboard, Configuration } from '~/types/replicants';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const teamScoreboard = defineModel<Scoreboard["homeTeam" | "awayTeam"]>();
const props = defineProps<{
  team: Configuration["homeTeam" | "awayTeam"]
}>();

</script>

<style>

</style>