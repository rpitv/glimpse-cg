<template>
  <StandingsTombstone :class="(channels[channelIndex]!.standings && !route.query.preview) || preview ? 'show' : 'hide'" />
</template>

<script setup lang="ts">
import StandingsTombstone from './StandingsTombstone.vue';

const route = useRoute();
const replicants = await useReplicants();
const preview = ref(route.query.preview === 'standings' || false);
const channelIndex = ref(0);

if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);
const channels = replicants.channels;
</script>

<style scoped lang="scss">

</style>
