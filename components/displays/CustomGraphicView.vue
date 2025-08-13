<template>
	<div>
		<div v-for="(customGraphic, i) in customGraphics" :key="i">
			<img :src="customGraphic.imagePath" :alt="customGraphic.name" :class="channelGraphics[i] ? '' : 'hidden'" />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Fullscreen, Channels } from '~/types/replicants';

const route = useRoute();
const preview = ref(route.query.preview === "customgraphic" || false);

let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = await useReplicant<Channels>("channels");
const fullscreen = await useReplicant<Fullscreen>("fullscreen");

const channelGraphics = computed(() => channels.value![channelIndex.value].custom);
const customGraphics = computed(() => fullscreen.value!.custom);
</script>

<style scoped lang="scss">
div {
	position: absolute;
}
img {
	position: absolute;
	top: 0;
	left: 0;

	width: 100vw;
	height: 100vh;

	transition: opacity 1s;
}
.hidden {
	opacity: 0;
}
</style>
