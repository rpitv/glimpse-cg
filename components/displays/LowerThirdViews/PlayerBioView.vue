<template>
	<div :class="channels![channelIndex].playerBio || preview ? 'show' : 'hide'">
		<ESPNPlayerBio v-if="espnStyles.indexOf(configuration!.style) !== -1" />
		<RPITVPlayerBio v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import { espnStyles, rpiTVStyles} from "../util";
import ESPNPlayerBio from "../styles/espn/lower-third/PlayerBio.vue";
import RPITVPlayerBio from "../styles/rpitv/football/PlayerBio.vue";
import { type Channels, type Configuration } from "~/types/replicants";

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

<style scoped>

</style>
