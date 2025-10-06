<template>
  <div class="p-6">
    <USwitch v-model="channels[0]!.scoreboard" size="xl" unchecked-icon="fa6-solid:xmark" checked-icon="fa6-solid:check" label="Scorebug" description="Turn on or off the scorebug" />
    <General />
  </div>
</template>

<script lang="ts" setup>
import General from "~/components/graphics-dashboard/scoreboard/General/index.vue";

const replicants = await useReplicants();
const channels = replicants.channels;

</script>

<style>

</style>