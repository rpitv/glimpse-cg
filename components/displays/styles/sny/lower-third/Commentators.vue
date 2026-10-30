<template>
  <div>
    <div v-if="commentators.mode === '2 Person BOOTH'">
      <twopbooth :preview="preview" />
    </div>
    <div v-else-if="commentators.mode === '3 Person BOOTH'">
      <threepbooth :preview />
    </div>
    <div v-else-if="commentators.mode === '3 Person BENCH'">
      <threepbench :preview />
    </div>
  </div>
</template>

<script setup lang="ts">
import twopbooth from './commentators/twopbooth.vue';
import threepbooth from './commentators/threepbooth.vue';
import threepbench from './commentators/threepbench.vue';

const replicants = await useReplicants();
const commentators = replicants.lowerThird.commentators;
const route = useRoute();
const preview = ref(!!route.query.preview || false);

</script>

<style scoped>
</style>