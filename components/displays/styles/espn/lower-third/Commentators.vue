<template>
  <img
    :style="commentatorsImage"
    :src="commentatorsGraphic"
  >
  <div :style="commentatorsContainer">
    <div
      v-for="(person, i) of people"
      :key="i"
      class="commentator"
    >
      <span
        v-if="person.name"
        :style="{
          color: person.nameColor || 'rgb(63, 64, 59)',
          fontSize: person.nameSize + 3.5 + 'vh',
        }"
      >{{ person.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import commentatorsGraphic from '~/assets/espn/Commentators.png';
import type { CSSProperties } from 'vue';
import { computed } from 'vue';

const replicants = await useReplicants();
const commentators = replicants.lowerThird.commentators;
const people = ref(commentators.people);

const commentatorsImage = computed((): CSSProperties => {
  return {
    bottom: commentators.offsetY + 'vh',
    left: commentators.offsetX + 'vw',
  };
});
const commentatorsContainer = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    bottom: commentators.offsetY + 17 + 'vh',
    display: 'flex',
    height: '5vh',
    justifyContent: 'space-around',
    left: commentators.offsetX + 14 + 'vw',
    position: 'absolute',
    width: '72vw',
  };
});

watch(() => commentators, () => {
  people.value = commentators.people;
}, { deep: true });
</script>

<style scoped>
@font-face {
	font-family: "swiss721_med";
	src: url('~/assets/espn/Swiss721Medium.ttf')
}
div {
	position: absolute;
	font-family: "swiss721_med";
}
img {
	position: absolute;
	left: 0;
	width: 100vw;
	height: 100vh;
	transition: opacity 1s;
}
.commentator {
  position: relative
}
</style>
