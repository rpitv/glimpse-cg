<template>
	<div :class="channels![channelIndex].bug || preview ? 'show' : 'hide'">
		<ESPNBug v-if="espnStyles.indexOf(configuration!.style) !== -1" />
		<RPITVBug v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import type { Channels, Configuration } from "~/types/replicants";
import ESPNBug from "../styles/espn/lower-third/Bug.vue";
import RPITVBug from "../styles/rpitv-lower-thirds/Bug.vue";
import { espnStyles, rpiTVStyles} from "../util";

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
