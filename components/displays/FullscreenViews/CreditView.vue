<template>
	<div :class="channels![channelIndex].credits || preview ? 'show' : 'hide'">
		<ESPNCredits v-if="espnStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles } from "../util";
import type { Configuration, Channels } from '~/types/replicants';
import ESPNCredits from "../styles/espn/fullscreen/Credits.vue";

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

const channels = useState<Channels>("channels");
const configuration = useState<Configuration>("configuration");
</script>

<style scoped lang="scss">
</style>
