<template>
	<div>
		<div class="w-[100vw] h-[100vh]" v-for="(customGraphic, i) in customGraphics" :key="i">
			<img v-if="(route.query.id && route.query.id === customGraphic._id && preview) || (!preview)" :src="customGraphic.imagePath" :class="channelGraphics![i]?.show ? 'show' : 'hide'" />
		</div>
	</div>
</template>

<script setup lang="ts">
const route = useRoute();
const preview = ref(route.query.preview === "customgraphics" || false);

let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const replicants = await useReplicants();
const channelGraphics = ref(replicants.channels[channelIndex.value]?.custom);
const customGraphics = ref(replicants.fullscreen.custom);

watch(
  () => replicants.channels[channelIndex.value]?.custom,
  (newVal) => {
    channelGraphics.value = newVal;
  },
  { immediate: true }
);

watch(
  () => replicants.fullscreen.custom,
  (newVal) => {
    customGraphics.value = newVal;
  },
  { immediate: true }
);



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

}

.show {
  transition: 1s;
  opacity: 1;
}
.hide {
  transition: 1s;
	opacity: 0;
}
</style>
