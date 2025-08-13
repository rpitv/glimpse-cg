<template>
  <div id="graphics-dashboard">
    <div>
      <LowerThirds />
    </div>
    <div>
      <Preview />
    </div>
  </div>
</template>

<script lang="ts" setup>
import LowerThirds from '~/components/graphics-dashboard/lower-thirds/index.vue';
import Preview from '~/components/graphics-dashboard/preview.vue';
</script>

<style>
#graphics-dashboard {
  display: grid;
  grid-template-columns: 3fr 2fr;
}

</style>