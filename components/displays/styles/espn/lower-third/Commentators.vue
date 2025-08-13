<template>
	<img :style="commentatorsImage" :src="commentatorsGraphic" >
	<div :style="commentatorsContainer">
    <div v-for="(person, i) of commentators!.people" :key="i" class="commentator">
      <span v-if="person.name" :style="{
        color: person.nameColor || 'rgb(63, 64, 59)',
        fontSize: person.nameSize + 3.5 + 'vh'
      }">{{ person.name }}</span>
    </div>
	</div>
</template>

<script setup lang="ts">
import commentatorsGraphic from "~/assets/espn/Commentators.png"
import type { CSSProperties } from "vue";
import { computed } from "vue";
import type { LowerThird } from "~/types/replicants";

const replicants = useState<LowerThird>("lowerThird");
const commentators = computed(() => replicants.value?.commentators);

const commentatorsImage = computed((): CSSProperties => {
	return {
		bottom: commentators.value!.offsetY + "vh",
	}
});
const commentatorsContainer = computed((): CSSProperties => {
	return {
		alignItems: "center",
		bottom: commentators.value!.offsetY+ 17 + "vh",
		display: "flex",
		height: "5vh",
		justifyContent: "space-around",
		left: "14vw",
		position: "absolute",
		width: "72vw",
	}
});
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
</style>
