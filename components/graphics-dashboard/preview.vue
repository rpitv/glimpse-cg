<template>
  <div>
    <UCard
      class="shadow-none inset-shadow-none ring-0 inset-ring-0 rounded-none border-1 border-(--tw-ring-color)"
      :ui="{
      }"
    >
      <p class="text-2xl">
        Preview
      </p>
      <br>
      <div v-if="loading && graphicsStore.selectedGraphic.name">
        <UProgress indeterminate />
        <p class="text-center">
          Loading Preview...
        </p>
      </div>
      <iframe
        v-if="graphicsStore.selectedGraphic.name"
        :src="`/display/?preview=${graphicsStore.selectedGraphic.name}&dev=1&${graphicsStore.selectedGraphic.index !== -1 ? `index=${graphicsStore.selectedGraphic.index}` : ''}`"
        @load="loading = false"
      />
      <p v-else>
        No Graphic Selected
      </p>
      <div v-if="graphicsStore.selectedGraphic.index !== -1 && graphicsStore.selectedGraphic.name === 'customgraphic'">
        <UFormField
          class="mt-4"
          label="Offset X"
          help="Adjust the horizontal position of this graphic"
        >
          <UInputNumber
            v-model="fullscreen.custom[graphicsStore.selectedGraphic.index]!.offsetX"
          />
        </UFormField>
        <UFormField
          label="Offset Y"
          help="Adjust the vertical position of this graphic"
        >
          <UInputNumber
            v-model="fullscreen.custom[graphicsStore.selectedGraphic.index]!.offsetY"
          />
        </UFormField>
        <UCheckbox
          v-model="fullscreen.custom[graphicsStore.selectedGraphic.index]!.preserveSize"
          class="mt-4"
          size="xl"
          label="Preserve Size"
          description="Keep the original size of the graphic"
        />
        <div v-if="!fullscreen.custom[graphicsStore.selectedGraphic.index]?.preserveSize">
          <UCheckbox
            v-model="fullscreen.custom[graphicsStore.selectedGraphic.index]!.preserveRatio"
            class="mt-2"
            size="xl"
            label="Preserve Aspect Ratio"
            description="Keep the original aspect ratio of the graphic"
          />
          <UFormField
            v-if="fullscreen.custom[graphicsStore.selectedGraphic.index]?.preserveRatio"
            class="mt-2"
            label="Size"
            help="Adjust the size of the graphic while maintaining its aspect ratio"
          >
            <UInputNumber
              v-model="fullscreen.custom[graphicsStore.selectedGraphic.index]!.size"
              :min="0"
            />
          </UFormField>
          <div v-if="!fullscreen.custom[graphicsStore.selectedGraphic.index]?.preserveSize && !fullscreen.custom[graphicsStore.selectedGraphic.index]?.preserveRatio">
            <UFormField
              class="mt-2"
              label="Width"
              help="Adjust the width of the graphic"
            >
              <UInputNumber
                v-model="fullscreen.custom[graphicsStore.selectedGraphic.index]!.width"
                :min="0"
              />
            </UFormField>
            <UFormField
              class="mt-2"
              label="Height"
              help="Adjust the height of the graphic"
            >
              <UInputNumber
                v-model="fullscreen.custom[graphicsStore.selectedGraphic.index]!.height"
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
const fullscreen = replicants.fullscreen;

watch(() => graphicsStore.selectedGraphic, (n, o) => {
  if (n.name !== o.name || n.index !== o.index)
    loading.value = true;

  if (graphicsStore.selectedGraphic.name !== 'customgraphic')
    graphicsStore.selectedGraphic.index = -1;
});

// watch(currentGraphic, (newVal) => {
//   if (newVal) {
//     const index = fullscreen.value.custom.findIndex(graphic => graphic._id === newVal._id);
//     if (index !== -1) {
//       fullscreen.value.custom[index] = newVal;
//       fullscreen.value.custom = [...fullscreen.value.custom]; // Trigger reactivity
//     }
//   }
// }, { deep: true });
</script>

<style>
iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
}
</style>
