<template>
	<div>
		<div v-for="(customGraphic, i) in customGraphics" :key="i">
			<img :src="customGraphic.imagePath" :alt="customGraphic.name" :class="channelGraphics[i] ? '' : 'hidden'" />
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute();
const preview = ref(route.query.preview === "customgraphic" || false);

let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const replicants = await useReplicants();
const channelGraphics = replicants.channels[channelIndex.value].custom;
const customGraphics = replicants.fullscreen.custom;
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
