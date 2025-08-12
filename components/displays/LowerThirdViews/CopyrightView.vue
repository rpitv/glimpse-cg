<template>
	<div :class="channels![channelIndex].copyright || preview ? 'show' : 'hide'">
		<ESPNCopyright v-if="espnStyles.indexOf(configuration!.style) !== -1" />
		<RPITVCopyright v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import type { Channels, Configuration } from "~/types/replicants";
import ESPNCopyright from "../styles/espn/lower-third/Copyright.vue";
import RPITVCopyright from "../styles/rpitv/lower-third/Copyright.vue";
import { espnStyles, rpiTVStyles } from "../util";

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
