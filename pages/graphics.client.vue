<template>
  <div id="graphics-dashboard" >
    <GraphicsList v-model="selectedGraphic" />
    <Customization>
      <component :is="selectedGraphic.component" />
    </Customization>
    <Preview :selectedGraphic />
  </div>
</template>

<script lang="ts" setup>
import GraphicsList from '~/components/graphics-dashboard/lower-thirds/index.vue';
import Customization from '~/components/graphics-dashboard/customization/index.vue';
import Preview from '~/components/graphics-dashboard/Preview.vue';

const selectedGraphic = ref({
  component: null as Component | null,
  name: ''
});
</script>

<style>
#graphics-dashboard {
  display: grid;
  grid-template-columns: 2fr 5fr 3fr;
}

</style>