<template>
  <div id="graphics" :style="route.query.dev === '1' ? 'background-color: white;' : ''">
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();

definePageMeta({
  layout: 'none'
});
</script>

<style>
#graphics {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}
</style>