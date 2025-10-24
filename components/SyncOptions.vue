<template>
  <UCard>
    <template #header>
      <p class="text-2xl">Sync Options</p>
    </template>
    <template #default>
      <u class="text-xl">General</u>
      <UCheckbox size="xl" label="Sync Clock" v-model="sync.clock" />
      <UCheckbox size="xl" label="Sync Period" v-model="sync.period" />
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <u class="text-lg">Away Team</u>
          <UCheckbox size="xl" label="Sync Away Score" v-model="sync.awayTeam.score" />
        </div>
        <div>
          <u class="text-lg">Home Team</u>
          <UCheckbox size="xl" label="Sync Home Score" v-model="sync.homeTeam.score" />
        </div>
      </div>
      <div class="mt-4"><u class="text-xl">Hockey</u></div>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <u class="text-lg">Away Team</u>
          <UCheckbox size="xl" label="Sync Away Shots on Goal" v-model="sync.awayTeam.hockey.sog" />
          <UCheckbox size="xl" label="Sync Away Faceoffs Won" v-model="sync.awayTeam.hockey.faceoff" />
          <UCheckbox size="xl" label="Sync Away Penalties" v-model="sync.awayTeam.hockey.penalty" />
        </div>
        <div>
          <u class="text-lg">Home Team</u>
          <UCheckbox size="xl" label="Sync Home Shots on Goal" v-model="sync.homeTeam.hockey.sog" />
          <UCheckbox size="xl" label="Sync Home Faceoffs Won" v-model="sync.homeTeam.hockey.faceoff" />
          <UCheckbox size="xl" label="Sync Home Penalties" v-model="sync.homeTeam.hockey.penalty" />
        </div>
      </div>
      <div class="mt-4"><u class="text-xl mt-4">Football</u></div>
      <UCheckbox size="xl" label="Sync Downs" v-model="sync.football.downs" />
      <UCheckbox size="xl" label="Sync Yards to Go" v-model="sync.football.yardsToGo" />
      <UCheckbox size="xl" label="Sync Possession" v-model="sync.football.possession" />
      <UCheckbox size="xl" label="Sync Play Clock" v-model="sync.football.playClock" />
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <u class="text-lg">Away Team</u>
          <UCheckbox size="xl" label="Sync Away Timeouts" v-model="sync.awayTeam.football.timeouts" />
        </div>
        <div>
          <u class="text-lg">Home Team</u>
          <UCheckbox size="xl" label="Sync Home Timeouts" v-model="sync.homeTeam.football.timeouts" />
        </div>
      </div>
      <UButton @click="syncEverything" class="mt-12">Enable Sync For Everything</UButton>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const replicants = await useReplicants();
const sync = replicants.configuration.sync;

function syncEverything() {
  sync.clock = true;
  sync.period = true;
  sync.awayTeam.score = true;
  sync.homeTeam.score = true;
  sync.awayTeam.hockey.sog = true;
  sync.awayTeam.hockey.faceoff = true;
  sync.awayTeam.hockey.penalty = true;
  sync.homeTeam.hockey.sog = true;
  sync.homeTeam.hockey.faceoff = true;
  sync.homeTeam.hockey.penalty = true;
  sync.football.downs = true;
  sync.football.yardsToGo = true;
  sync.football.possession = true;
  sync.football.playClock = true;
  sync.awayTeam.football.timeouts = true;
  sync.homeTeam.football.timeouts = true;
}

</script>

<style>

</style>