<template>
	<div :class="channels![channelIndex].locator || preview ? 'show' : 'hide'">
		<ESPNLocator v-if="espnStyles.indexOf(configuration!.style) !== -1" />
		<RPITVLocator v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles} from "../util";
import ESPNLocator from "../styles/espn/lower-third/Locator.vue";
import RPITVLocator from "../styles/rpitv-lower-thirds/Locator.vue";
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
