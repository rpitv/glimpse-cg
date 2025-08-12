<template>
	<div :class="channels![channelIndex].goToBreak || preview ? 'show' : 'hide'">
		<ESPNScoreboard v-if="espnStyles.indexOf(configuration!.style) !== -1" />
		<RPITVScoreboard v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles} from "../util";
import ESPNScoreboard from "../styles/espn/lower-third/GoToBreak.vue";
import RPITVScoreboard from "../styles/rpitv-lower-thirds/Scoreboard.vue";
import type { Channels, Configuration } from "~/types/replicants";

defineProps({
	preview: {
		type: Boolean,
		required: false,
		default: false
	}
});

const route = useRoute();
let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = useReplicant<Channels>("channels");
const configuration = useReplicant<Configuration>("configuration");
</script>

<style scoped lang="scss">
</style>
