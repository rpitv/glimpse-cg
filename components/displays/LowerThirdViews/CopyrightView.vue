<template>
  <div :class="(channels![channelIndex]!.copyright && !route.query.preview) || preview ? 'show' : 'hide'">
    <ESPNCopyright v-if="espnStyles.indexOf(configuration!.style) !== -1" />
    <RPITVCopyright v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
  </div>
</template>

<script setup lang="ts">
import ESPNCopyright from '../styles/espn/lower-third/Copyright.vue';
import RPITVCopyright from '../styles/rpitv/lower-third/Copyright.vue';
import { espnStyles, rpiTVStyles } from '../util';

const route = useRoute();
const replicants = await useReplicants();
const preview = ref(route.query.preview === 'copyright' || false);

const channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = replicants.channels;
const configuration = replicants.configuration;
</script>

<style scoped lang="scss">

</style>
