<template>
  <div class="p-6">
    <Hockey v-if="configuration.sport === 'hockey' || configuration.sport === 'acha' || configuration.sport === 'lacrosse'" />
    <General v-else />
  </div>
</template>

<script lang="ts" setup>
import General from "~/components/graphics-dashboard/scoreboard/General/index.vue";
import Hockey from "~/components/graphics-dashboard/scoreboard/Hockey/index.vue";

const replicants = await useReplicants();
const configuration = replicants.configuration;

</script>

<style>

</style>