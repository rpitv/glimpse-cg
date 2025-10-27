<template>
	<div>
		<div v-for="(customGraphic, i) in customGraphics" :key="i">
			<img 
        :style="graphicsProps(i)"
        :src="customGraphic.imagePath"
        :class="(!preview && channelGraphics![i]?.show) || (preview && route.query.id === customGraphic._id) ? 'show' : 'hide'" 
      />
		</div>
	</div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

const route = useRoute();
const preview = ref(route.query.preview === "customgraphic" || false);

let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const replicants = await useReplicants();
const channelGraphics = ref(replicants.channels[channelIndex.value]?.custom);
const customGraphics = ref(replicants.fullscreen.custom);

function graphicsProps(i: number): CSSProperties {
  const graphic = customGraphics.value?.[i];
  if (!graphic) return {};
  let style = {
    position: 'absolute',
    left: `${graphic.offsetX}vw`,
    top: `${graphic.offsetY}vh`,
    width: 'auto',
    height: 'auto',
  } as CSSProperties;

  if (!graphic.preserveSize && !graphic.preserveRatio) {
    style.width = `${graphic.width}vw`;
    style.height = `${graphic.height}vh`;
  } else if (!graphic.preserveSize && graphic.preserveRatio) {
    style.width = `${graphic.size}vw`;
    style.height = 'auto';
  }
  if (preview) {
    style.transition = '0s';
  }
  return style;
}

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

.show {
  transition: 1s;
  opacity: 1;
}
.hide {
  transition: 1s;
	opacity: 0;
}
</style>
