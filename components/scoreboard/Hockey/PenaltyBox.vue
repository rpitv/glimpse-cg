<template>
  <UCard class="rounded-none">
    <template #header>
      <b class="text-2xl">Penalty Box <Info>The penalty box is intended as a debugger due to the behavior of sync, not for powerplays.</Info></b>
    </template>
    <div class="flex justify-around gap-5">
      <PenaltyTeam team="awayTeam" />
      <USeparator class="h-48" orientation="vertical" />
      <PenaltyTeam team="homeTeam" />
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import PenaltyTeam from './PenaltyTeam.vue';

const replicants = await useReplicants();
const hockey = replicants.scoreboard.hockey

</script>

<style>

</style>