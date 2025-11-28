<template>
  <img
    :style="bugStyle"
    :src="rpitvBug"
  >
</template>

<script setup lang="ts">
import rpitvBug from '~/assets/rpitv-modern/rpitvBug.png';
import { computed, type CSSProperties } from 'vue';

const replicants = await useReplicants();
const bug = replicants.lowerThird.bug;

const bugStyle = computed((): CSSProperties => {
  return {
    height: '100vh',
    left: bug.offsetX + 'vw',
    position: 'absolute',
    bottom: bug.offsetY + 'vh',
    width: '100vw',
  };
});
</script>

<style scoped>
</style>
