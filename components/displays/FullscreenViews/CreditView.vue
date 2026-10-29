<template>
  <div :class="channels[channelIndex]!.credits ? 'show' : 'hide'">
    <ESPNCredits v-if="espnStyles.indexOf(configuration!.style) !== -1" />
    <SNYCredits v-if="configuration.style === 'sny'" />
  </div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles } from '../util';
import ESPNCredits from '../styles/espn/fullscreen/Credits.vue';
import SNYCredits from '../styles/sny/fullscreen/Credits.vue';

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
