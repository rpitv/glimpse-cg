<template>
	<div :class="(channels[channelIndex]!.credits && !route.query.preview) || preview ? 'show' : 'hide'">
		<ESPNCredits v-if="espnStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles } from "../util";
import ESPNCredits from "../styles/espn/fullscreen/Credits.vue";


const route = useRoute();
const replicants = await useReplicants();
const preview = ref(route.query.preview === "credits" || false);

let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = replicants.channels;
const configuration = replicants.configuration;
</script>

<style scoped lang="scss">
</style>
