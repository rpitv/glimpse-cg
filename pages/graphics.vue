<template>
  <USplitter auto-save-id="graphic-splitter" :items class="rounded-lg border border-default overflow-hidden" 
    :ui="{ 
      handle: 'data-[orientation=horizontal]:w-px data-[orientation=vertical]:h-px bg-border transition-colors data-[state=hover]:bg-primary data-[state=drag]:bg-primary' 
    }"
  >
    <template #graphics>
      <GraphicsList />
    </template>
    <template #customization>
      <Customization ref="customization">
        <component :is="graphicsStore.selectedGraphic.component" />
      </Customization>
    </template>
    <template #preview>
      <Preview ref="preview" />
    </template>
  </USplitter>
</template>
<script lang="ts" setup>
import GraphicsList from '~/components/graphics-dashboard/graphics.vue';
import Customization from '~/components/graphics-dashboard/customization/index.vue';
import Preview from '~/components/graphics-dashboard/preview.vue';
import { useGraphicsStore } from '~/store/graphics';
import type { SplitterItem } from '@nuxt/ui'

const graphicsStore = useGraphicsStore();
const items: SplitterItem[] = [
  { slot: 'graphics', minSize: 16, defaultSize: 25, class: 'min-w-[300px]' },
  { slot: 'customization', minSize: 30, defaultSize: 50 },
  { slot: 'preview', minSize: 15, defaultSize: 25 }
]
</script>

<style>
#graphics-dashboard {
  display: grid;
  grid-template-columns: 2fr 5fr 3fr;
  align-items: start;
}
</style>
