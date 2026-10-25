<template>
  <div :class="channels[channelIndex]!.outoftown ? 'show' : 'hide'">
    <ESPNOutOfTown v-if="espnStyles.indexOf(configuration!.style) !== -1" />
  </div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles } from '../util';
import ESPNOutOfTown from '../styles/espn/fullscreen/OutOfTown.vue';

const route = useRoute();
const replicants = await useReplicants();

const channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = replicants.channels;
const configuration = replicants.configuration;
</script>

<style scoped lang="scss">
</style>
