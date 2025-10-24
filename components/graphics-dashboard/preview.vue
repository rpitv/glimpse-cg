<template>
  <div>
    <UCard class="rounded-none">
      <p class="text-2xl">
        Preview
      </p>
      <br></br>
      <div v-if="loading &&  graphicsStore.selectedGraphic.name">
        <UProgress indeterminate />
        <p class="text-center">Loading Preview...</p>
      </div>
      <iframe v-if="graphicsStore.selectedGraphic.name" :src="`/display/?preview=${graphicsStore.selectedGraphic.name}&dev=1&${graphicsStore.selectedGraphic.id ? `id=${graphicsStore.selectedGraphic.id}` : ''}`" @load="loading = false">
      </iframe>
      <p v-else>No Graphic Selected</p>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { useGraphicsStore } from '~/store/graphics';

const graphicsStore = useGraphicsStore();

const loading = ref(true);


watch(graphicsStore.selectedGraphic, (newValue) => {
  console.log('selectedGraphic changed:', newValue);
  if (newValue) loading.value = true;
}, { deep: true });

onMounted(() => {
  loading.value = false;
});
</script>

<style>
iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
}
</style>