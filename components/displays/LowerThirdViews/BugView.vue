<template>
	<div :class="channels![channelIndex].bug || preview ? 'show' : 'hide'">
		<ESPNBug v-if="espnStyles.indexOf(configuration!.style) !== -1" />
		<RPITVBug v-if="rpiTVStyles.indexOf(configuration!.style) !== -1" />
	</div>
</template>

<script setup lang="ts">
import type { Channels, Configuration } from "~/types/replicants";
import ESPNBug from "../styles/espn/lower-third/Bug.vue";
import RPITVBug from "../styles/rpitv/lower-third/Bug.vue";
import { espnStyles, rpiTVStyles} from "../util";


const route = useRoute();
const preview = ref(route.query.preview === "bug" || false);

let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = await useReplicant<Channels>("channels");
const configuration = await useReplicant<Configuration>("configuration");


</script>

<style scoped lang="scss">
</style>
