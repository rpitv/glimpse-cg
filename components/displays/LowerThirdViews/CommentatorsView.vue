<template>
  <div :class="showCommentators">
    <ESPNCommentators v-if="espnStyles.indexOf(configuration!.style) !== -1" />
    <RPITVCommentators v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
    <SNYCommentators v-if="configuration.style === 'sny'" />
  </div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles } from '../util';
import ESPNCommentators from '../styles/espn/lower-third/Commentators.vue';
import RPITVCommentators from '../styles/rpitv/lower-third/Commentators.vue';
import SNYCommentators from '../styles/sny/lower-third/Commentators.vue';

const route = useRoute();
const replicants = await useReplicants();

const channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = replicants.channels;
const configuration = replicants.configuration;

const showCommentators = computed(() => {
  if (replicants.configuration.style !== 'sny')
    return channels[channelIndex.value]!.commentators ? 'show' : 'hide';
  return '';
})
</script>

<style scoped lang="scss">
</style>
