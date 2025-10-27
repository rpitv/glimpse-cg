<template>
  <div id="graphics-dashboard" >
    <GraphicsList />
    <Customization>
      <component :is="graphicsStore.selectedGraphic.component" />
    </Customization>
    <Preview />
  </div>
</template>

<script lang="ts" setup>
import GraphicsList from '~/components/graphics-dashboard/lower-thirds/index.vue';
import Customization from '~/components/graphics-dashboard/customization/index.vue';
import Preview from '~/components/graphics-dashboard/preview.vue';
import { useGraphicsStore } from '~/store/graphics';

const graphicsStore = useGraphicsStore();
const { selectedGraphic } = graphicsStore;
</script>

<style>
#graphics-dashboard {
  display: grid;
  grid-template-columns: 2fr 5fr 3fr;
}

</style>