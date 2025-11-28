<template>
  <div>
    <div
      v-for="(customGraphic, i) in customGraphics"
      :key="i"
    >
      <img
        :ref="el => imgRefs[i] = el"
        :style="graphicsProps(i)"
        :src="customGraphic.imagePath"
        :class="(!route.query.preview && channelGraphics![i]?.show) || (preview && route.query.id === customGraphic._id) ? 'show' : 'hide'"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';

const route = useRoute();
const preview = ref(route.query.preview === 'customgraphic' || false);

const channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const replicants = await useReplicants();
const channelGraphics = ref(replicants.channels[channelIndex.value]?.custom);
const customGraphics = ref(replicants.fullscreen.custom);
const imgRefs = ref<HTMLImageElement[]>([]);

function graphicsProps(i: number): CSSProperties {
  const graphic = customGraphics.value?.[i];
  if (!graphic) return {};
  const style = {
    position: 'absolute',
    left: `${graphic.offsetX}vw`,
    top: `${graphic.offsetY}vh`,
    width: 'auto',
    height: 'auto',
  } as CSSProperties;

  if (!graphic.preserveSize && !graphic.preserveRatio) {
    style.width = `${graphic.width}vw`;
    style.height = `${graphic.height}vh`;
  }
  else if (!graphic.preserveSize && graphic.preserveRatio) {
    style.width = `${graphic.size}vw`;
    style.height = 'auto';
  }
  if (preview.value) {
    style.transition = '0s';
    if (graphic.preserveSize) {
      const imgWidth = getImageWidth(i);
      if (imgWidth) {
        const aspectRatio = imgWidth / 1920 * 100;
        style.width = `${aspectRatio}vw`;
        style.height = `auto`;
      }
    }
  }
  return style;
}

function getImageWidth(index: number): number | undefined {
  const img = imgRefs.value[index];
  return img ? img.naturalWidth : undefined;
}

watch(
  () => replicants.channels[channelIndex.value]?.custom,
  (newVal) => {
    channelGraphics.value = newVal;
  },
  { immediate: true },
);

watch(
  () => replicants.fullscreen.custom,
  (newVal) => {
    customGraphics.value = newVal;
  },
  { immediate: true },
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
