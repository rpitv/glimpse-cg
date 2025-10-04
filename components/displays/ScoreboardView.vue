<template>
	<div :class="(channels![channelIndex]!.scoreboard && !route.query.preview) || preview ? 'show' : 'hide'">
		<ESPNScoreboard v-if="configuration!.style === 'espn'" />
		<RPITV v-if="configuration!.style === 'rpitv'" />
		<RPITVFootball v-if="configuration!.style === 'football'" />
	</div>
</template>

<script setup lang="ts">
import ESPNScoreboard from "./styles/espn/ScoreboardView.vue";
import RPITV from "./styles/rpitv/general/ScoreboardView.vue";
import RPITVFootball from "./styles/rpitv/football/ScoreboardView.vue";

const route = useRoute();
const replicants = await useReplicants();
const preview = ref(route.query.preview === "scoreboard" || false);

let channelIndex = ref(0);
if (route.query.channel)
	channelIndex.value = parseInt(route.query.channel as string);


const channels = replicants.channels;
const configuration = replicants.configuration;

</script>

<style scoped lang="scss">

</style>
