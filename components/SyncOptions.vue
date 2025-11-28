<template>
  <UCard>
    <template #header>
      <p class="text-2xl">
        Sync Options
      </p>
    </template>
    <template #default>
      <u class="text-xl">General</u>
      <UCheckbox
        v-model="sync.clock"
        size="xl"
        label="Sync Clock"
      />
      <UCheckbox
        v-model="sync.period"
        size="xl"
        label="Sync Period"
      />
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <u class="text-lg">Away Team</u>
          <UCheckbox
            v-model="sync.awayTeam.score"
            size="xl"
            label="Sync Away Score"
          />
        </div>
        <div>
          <u class="text-lg">Home Team</u>
          <UCheckbox
            v-model="sync.homeTeam.score"
            size="xl"
            label="Sync Home Score"
          />
        </div>
      </div>
      <div class="mt-4">
        <u class="text-xl">Hockey</u>
      </div>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <u class="text-lg">Away Team</u>
          <UCheckbox
            v-model="sync.awayTeam.hockey.sog"
            size="xl"
            label="Sync Away Shots on Goal"
          />
          <UCheckbox
            v-model="sync.awayTeam.hockey.faceoff"
            size="xl"
            label="Sync Away Faceoffs Won"
          />
          <UCheckbox
            v-model="sync.awayTeam.hockey.penalty"
            size="xl"
            label="Sync Away Penalties"
          />
        </div>
        <div>
          <u class="text-lg">Home Team</u>
          <UCheckbox
            v-model="sync.homeTeam.hockey.sog"
            size="xl"
            label="Sync Home Shots on Goal"
          />
          <UCheckbox
            v-model="sync.homeTeam.hockey.faceoff"
            size="xl"
            label="Sync Home Faceoffs Won"
          />
          <UCheckbox
            v-model="sync.homeTeam.hockey.penalty"
            size="xl"
            label="Sync Home Penalties"
          />
        </div>
      </div>
      <div class="mt-4">
        <u class="text-xl mt-4">Football</u>
      </div>
      <UCheckbox
        v-model="sync.football.downs"
        size="xl"
        label="Sync Downs"
      />
      <UCheckbox
        v-model="sync.football.yardsToGo"
        size="xl"
        label="Sync Yards to Go"
      />
      <UCheckbox
        v-model="sync.football.possession"
        size="xl"
        label="Sync Possession"
      />
      <UCheckbox
        v-model="sync.football.playClock"
        size="xl"
        label="Sync Play Clock"
      />
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div>
          <u class="text-lg">Away Team</u>
          <UCheckbox
            v-model="sync.awayTeam.football.timeouts"
            size="xl"
            label="Sync Away Timeouts"
          />
        </div>
        <div>
          <u class="text-lg">Home Team</u>
          <UCheckbox
            v-model="sync.homeTeam.football.timeouts"
            size="xl"
            label="Sync Home Timeouts"
          />
        </div>
      </div>
      <UButton
        class="mt-12"
        @click="syncEverything"
      >
        Enable Sync For Everything
      </UButton>
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
