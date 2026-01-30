<template>
  <div class="w-full">
    <p class="text-2xl">{{ team === 'awayTeam' ? 'Away Team' : 'Home Team' }}</p>
    <UFormField class="mt-4" label="Player 1" :ui="{label: 'text-xl'}">
      <UFieldGroup>
        <UFormField label="Player Number">
          <UInput v-model="hockeyTeam.penalty.player1.number"></UInput>
        </UFormField>
        <UFormField label="Player Timer">
          <UInput v-model="hockeyTeam.penalty.player1.timer"></UInput>
        </UFormField>
      </UFieldGroup>
    </UFormField>
    <UFormField class="mt-4" label="Player 2" :ui="{label: 'text-xl'}">
      <UFieldGroup>
        <UFormField label="Player Number">
          <UInput v-model="hockeyTeam.penalty.player2.number"></UInput>
        </UFormField>
        <UFormField label="Player Timer">
          <UInput v-model="hockeyTeam.penalty.player2.timer"></UInput>
        </UFormField>
      </UFieldGroup>
    </UFormField>
  </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
  team: 'awayTeam' | 'homeTeam'
}>();

const replicants = await useReplicants();
const hockeyTeam = replicants.scoreboard.hockey[props.team];


</script>

<style>

</style>