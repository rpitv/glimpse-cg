<template>
	<div :class="(channels![channelIndex].goToBreak && !route.query.preview) || preview ? 'show' : 'hide'">
		<ESPNGoToBreak v-if="espnStyles.indexOf(configuration!.style) !== -1" />
		<RPITVGoToBreak v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles} from "../util";
import ESPNGoToBreak from "../styles/espn/lower-third/GoToBreak.vue";
import RPITVGoToBreak from "../styles/rpitv/lower-third/GoToBreak.vue";

defineProps({
	preview: {
		type: Boolean,
		required: false,
		default: false
	}
});

const route = useRoute();
const replicants = await useReplicants();
const preview = ref(route.query.preview === "gotobreak" || false);

let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = replicants.channels;
const configuration = replicants.configuration;
</script>

<style scoped lang="scss">
</style>
