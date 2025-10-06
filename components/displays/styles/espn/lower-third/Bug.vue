<template>
	<img :style="bugStyle" :src="espnbug">
</template>

<script setup lang="ts">
import espnbug from "~/assets/espn/espnBug.png";
import type { CSSProperties } from "vue";

const replicants = await useReplicants();
const bug = replicants.lowerThird.bug;

const bugStyle = computed((): CSSProperties => {
	return {
		height: "100vh",
		left: bug.offsetX + "vw",
		overflow: "hidden",
		position: "absolute",
		bottom: bug.offsetY - 1 + "vh",
		width: "100vw",
	}
});

</script>

<style scoped>
</style>
