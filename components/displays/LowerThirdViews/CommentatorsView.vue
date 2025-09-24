<template>
	<div :class="(channels![channelIndex].commentators && !route.query.preview) || preview ? 'show' : 'hide'">
		<ESPNCommentators v-if="espnStyles.indexOf(configuration!.style) !== -1"/>
		<RPITVCommentators v-if="rpiTVStyles.indexOf(configuration!.style) !== -1"/>
	</div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles} from "../util";
import ESPNCommentators from "../styles/espn/lower-third/Commentators.vue";
import RPITVCommentators from "../styles/rpitv/lower-third/Commentators.vue";

defineProps({
	preview: {
		type: Boolean,
		required: false,
		default: false
	}
});


const route = useRoute();
const replicants = await useReplicants();
const preview = ref(route.query.preview === "commentators" || false);

let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = replicants.channels;
const configuration = replicants.configuration;
</script>

<style scoped lang="scss">
</style>
