<template>
  <div>
    <UCard class="rounded-none">
      <p class="text-2xl">
        Preview
      </p>
      <br></br>
      <div v-if="loading">
        <UProgress indeterminate />
        <p class="text-center">Loading Preview...</p>
      </div>
      <iframe :src="`/display/?preview=${selectedGraphic.name}&dev=1`" @load="loading = false">
      </iframe>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue';


const loading = ref(true);
const props = defineProps({
  selectedGraphic: {
    type: Object as PropType<{ component: Component | null; name: string }> | null,
    required: true
  }
});


watch(props, (newValue) => {
  if (newValue) loading.value = true;
}, { deep: true });
</script>

<style>
iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
}
</style>