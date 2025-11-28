<template>
  <div :class="(channels![channelIndex].playerBio && !route.query.preview) || preview ? 'show' : 'hide'">
    <ESPNPlayerBio v-if="espnStyles.indexOf(configuration!.style) !== -1" />
    <RPITVPlayerBio v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
  </div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles } from '../util';
import ESPNPlayerBio from '../styles/espn/lower-third/PlayerBio.vue';
import RPITVPlayerBio from '../styles/rpitv/football/PlayerBio.vue';

const route = useRoute();
const replicants = await useReplicants();
const preview = ref(route.query.preview === 'playerbio' || false);

const channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = replicants.channels;
const configuration = replicants.configuration;
</script>

<style scoped>

</style>
