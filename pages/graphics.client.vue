<template>
  <div id="graphics-dashboard">
    <GraphicsList />
    <Customization ref="customization" >
      <component :is="graphicsStore.selectedGraphic.component" />
    </Customization>
    <Preview ref="preview" />
  </div>
</template>

<script lang="ts" setup>
import GraphicsList from '~/components/graphics-dashboard/graphics.vue';
import Customization from '~/components/graphics-dashboard/customization/index.vue';
import Preview from '~/components/graphics-dashboard/preview.vue';
import { useGraphicsStore } from '~/store/graphics';

const graphicsStore = useGraphicsStore();


</script>

<style>
#graphics-dashboard {
  display: grid;
  grid-template-columns: 2fr 5fr 3fr;
  align-items: start;
}
</style>
