<template>
  <div :class="(channels![channelIndex]!.bug && !route.query.preview) || preview ? 'show' : 'hide'">
    <ESPNBug v-if="espnStyles.indexOf(configuration!.style) !== -1" />
    <RPITVBug v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
  </div>
</template>

<script setup lang="ts">
import ESPNBug from '../styles/espn/lower-third/Bug.vue';
import RPITVBug from '../styles/rpitv/lower-third/Bug.vue';
import { espnStyles, rpiTVStyles } from '../util';

const route = useRoute();
const replicants = await useReplicants();
const preview = ref(route.query.preview === 'bug' || false);

const channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = replicants.channels;
const configuration = replicants.configuration;
</script>

<style scoped lang="scss">
</style>
