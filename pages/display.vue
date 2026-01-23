<template>
  <div
    id="graphics"
  >
    <MainView />
  </div>
</template>

<script lang="ts" setup>
import MainView from '~/components/displays/main.vue';

const route = useRoute();
useHead({
  bodyAttrs: {
    class: 'bg-transparent'
  }
})

definePageMeta({
  layout: 'none',
});
</script>

<style scoped>
#graphics {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
