<template>
  <div class="w-full text-center">
    <UCard class="rounded-none">
      <slot name="score-area">
        <u class="text-[20px]">SCORE</u>
        <div class="flex justify-center items-center gap-4">
          <p class="text-5xl">
            {{ teamScoreboard!.score }}
          </p>
        </div>
      </slot>
      <UModal
        v-if="teamScoreboard!.name || configuration[team].abbr"
        :ui="{
          content: 'max-w-3xl',
        }"
      >
        <UButton
          variant="link"
          class="text-gray-200 text-xl"
        >
          <div class="flex justify-center items-center gap-2">
            <img :src="teamScoreboard!.logo || configuration[team].logo" class="h-20" />
            <span class="relative flex items-center justify-center">
              <span>{{ teamScoreboard!.name || configuration[team].abbr }}</span>
              <span class="ml-2">
                <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
              </span>
            </span>
          </div>
        </UButton>
        <template #content>
          <UCard>
            <template #header>
              <p class="text-2xl">
                Edit <b>{{ teamScoreboard!.name || configuration[team].abbr }}</b> Visuals
              </p>
            </template>
            <template #default>
              <div class="flex justify-between">
                <div class="w-full">
                  <UFormField
                    label="Team Name"
                    help="The name of the team."
                  >
                    <UInput
                      v-model="teamScoreboard!.name"
                      :placeholder="configuration[team].abbr"
                    />
                  </UFormField>
                  <UFormField
                    class="mt-4"
                    label="Team Name Size"
                    help="Adjust the size of the team name."
                  >
                    <UInputNumber
                      v-model="teamScoreboard!.nameSize"
                      :step="0.1"
                      :format-options="{ minimumFractionDigits: 1 }"
                    />
                  </UFormField>
                  <UFormField
                    class="mt-4"
                    label="Team Logo"
                    help="The logo of the team."
                  >
                    <UInput
                      v-model="teamScoreboard!.logo"
                      class="w-full"
                      :placeholder="configuration[team].logo"
                    />
                  </UFormField>
                  <UFormField
                    class="mt-4"
                    label="Team Logo Size"
                    help="Adjust the size of the team logo."
                  >
                    <UInputNumber
                      v-model="teamScoreboard!.logoSize"
                      :step="0.1"
                      :format-options="{ minimumFractionDigits: 1 }"
                    />
                  </UFormField>
                </div>
                <div class="w-full">
                  <ColorPicker
                    v-model="teamScoreboard!.primaryColor"
                    label="Primary Color"
                    help="The primary color of the team."
                    :placeholder="configuration[team].primaryColor"
                  />
                  <ColorPicker
                    v-model="teamScoreboard!.secondaryColor"
                    label="Secondary Color"
                    help="The secondary color of the team."
                    :placeholder="configuration[team].secondaryColor"
                  />
                </div>
              </div>
            </template>
          </UCard>
        </template>
      </UModal>
      <i class="text-muted text-lg" v-else>Team Name Missing</i>

    </UCard>
    <UCard class="rounded-none" v-if="!slots['score-area']">
      <template #footer>
        <UTooltip
          text="Controls cannot be edited when sync is enabled."
          :disabled="!sync[team].score"
        >
          <UInputNumber
            v-model="teamScoreboard!.score"
            :disabled="sync[team].score"
            size="xl"
          />
        </UTooltip>
      </template>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const replicants = await useReplicants();
const slots = useSlots();
const configuration = replicants.configuration;
const sync = configuration.sync;

const props = defineProps<{
  team: 'awayTeam' | 'homeTeam';
}>();

const teamScoreboard = replicants.scoreboard[props.team];
</script>

<style>

</style>
