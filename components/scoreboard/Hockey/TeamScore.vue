<template>
  <BaseTeamScore :team="team">
    <template #score-area>
      <div :class="'flex justify-center items-center gap-4 ' + (team === 'homeTeam' ? 'flex-row-reverse' : '')">
        <div>
          <div>
            <u class="block text-[16px]">SHOTS ON GOAL</u>
            <UTooltip
              :disabled="!sync[team].hockey.sog"
              text="Controls cannot be edited when sync is enabled."
            >
              <UInputNumber
                v-model="hockey[team].sog"
                class="w-[150px]"
                variant="soft"
                :max="999"
                :min="0"
                :disabled="sync[team].hockey.sog"
                :ui="{
                  base: 'text-xl text-center min-w-[75px]',
                }"
              >
                <template #decrement>
                  <UButton
                    variant="ghost"
                    color="error"
                  >
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
          <UTooltip
            :disabled="!sync[team].score"
            text="Controls cannot be edited when sync is enabled."
          >
            <UInputNumber
              v-model="teamScoreboard!.score"
              class="w-[200px]"
              variant="ghost"
              :max="999"
              :min="0"
              :disabled="sync[team].score"
              :ui="{
                base: 'text-5xl text-center min-w-[75px]',
              }"
            >
              <template #decrement>
                <UButton
                  size="xl"
                  variant="ghost"
                  color="error"
                >
                  <FontAwesomeIcon icon="fa-solid fa-minus" />
                </UButton>
              </template>
              <template #increment>
                <UButton
                  size="xl"
                  variant="ghost"
                >
                  <FontAwesomeIcon icon="fa-solid fa-plus" />
                </UButton>
              </template>
            </UInputNumber>
          </UTooltip>
        </div>
      </div>
    </template>
    <template #footer-controls>
      <div></div>
    </template>
  </BaseTeamScore>
</template>

<script lang="ts" setup>
import type { Scoreboard } from '~/types/replicants';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import BaseTeamScore from '../TeamScore.vue';

const replicants = await useReplicants();
const configuration = replicants.configuration;
const hockey = replicants.scoreboard.hockey;
const sync = configuration.sync;

const props = defineProps<{
  team: 'awayTeam' | 'homeTeam';
}>();
const teamScoreboard = replicants.scoreboard[props.team];
</script>

<style>

</style>
