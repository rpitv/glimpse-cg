<template>
	<div :class="channels![channelIndex].credits || preview ? 'show' : 'hide'">
		<ESPNCredits v-if="espnStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles } from "../util";
import type { Configuration, Channels } from '~/types/replicants';
import ESPNCredits from "../styles/espn/fullscreen/Credits.vue";


const route = useRoute();

const preview = ref(route.query.preview === "credit" || false);

let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = await useReplicant<Channels>("channels");
const configuration = await useReplicant<Configuration>("configuration");
</script>

<style scoped lang="scss">
</style>
