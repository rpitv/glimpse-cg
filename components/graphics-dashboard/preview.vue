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
      <div v-if="graphicsStore.selectedGraphic.id && graphicsStore.selectedGraphic.name === 'customgraphic' && fullscreen">
        <UFormField label="Offset X" help="Adjust the horizontal position of this graphic">
          <UInputNumber
            v-model="currentGraphic!.offsetX"
          />
        </UFormField>
        <UFormField label="Offset Y" help="Adjust the vertical position of this graphic">
          <UInputNumber
            v-model="currentGraphic!.offsetY"
          />
        </UFormField>
        <UCheckbox class="mt-4" size="xl" v-model="currentGraphic!.preserveSize" 
          label="Preserve Size" 
          description="Keep the original size of the graphic" 
        />
        <div v-if="!currentGraphic?.preserveSize">
          <UCheckbox class="mt-2" size="xl" v-model="currentGraphic!.preserveRatio" 
            label="Preserve Aspect Ratio" 
            description="Keep the original aspect ratio of the graphic" 
          />
          <UFormField class="mt-2" v-if="currentGraphic?.preserveRatio" label="Size"
            help="Adjust the size of the graphic while maintaining its aspect ratio"
          >
            <UInputNumber
              v-model="currentGraphic!.size"
              :min="0"
            />
          </UFormField>
          <div v-if="!currentGraphic?.preserveSize && !currentGraphic?.preserveRatio">
            <UFormField class="mt-2" label="Width"
              help="Adjust the width of the graphic"
            >
              <UInputNumber
                v-model="currentGraphic!.width"
                :min="0"
              />
            </UFormField>
            <UFormField class="mt-2" label="Height"
              help="Adjust the height of the graphic"
            >
              <UInputNumber
                v-model="currentGraphic!.height"
                :min="0"
              />
            </UFormField>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import { useGraphicsStore } from '~/store/graphics';

const replicants = await useReplicants();
const graphicsStore = useGraphicsStore();
const loading = ref(true);
const fullscreen = computed({
  get: () => replicants.fullscreen,
  set: (val) => (replicants.fullscreen = val),
});
const currentGraphic = ref(fullscreen.value?.custom.find((graphic) => graphic._id === graphicsStore.selectedGraphic.id));

watch(() => graphicsStore.selectedGraphic, () => {
  currentGraphic.value = fullscreen.value.custom.find((graphic) => graphic._id === graphicsStore.selectedGraphic.id);
});

watch(currentGraphic, (newVal) => {
  if (newVal) {
    const index = fullscreen.value.custom.findIndex((graphic) => graphic._id === newVal._id);
    if (index !== -1) {
      fullscreen.value.custom[index] = newVal;
      fullscreen.value.custom = [...fullscreen.value.custom]; // Trigger reactivity
    }
  }
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