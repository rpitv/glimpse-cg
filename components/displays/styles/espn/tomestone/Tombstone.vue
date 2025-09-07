<template>
  <StandingsTombstone :class="channels![channelIndex].standings ? 'show' : 'hide'" />
</template>

<script setup lang="ts">
import type { Channels } from "~/types/replicants";
import StandingsTombstone from "./StandingsTombstone.vue";

const route = useRoute();
const preview = ref(route.query.preview === "tombstone" || false);
let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);
const channels = await useReplicant<Channels>("channels");
</script>

<style scoped lang="scss">

</style>
