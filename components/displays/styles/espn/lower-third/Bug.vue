<template>
	<img :style="bugStyle" :src="bug">
</template>

<script setup lang="ts">
import bug from "~/assets/espn/espnBug.png";
import type { CSSProperties } from "vue";
import type { LowerThird } from "~/types/replicants";


const lowerThird = useReplicant<LowerThird>("lowerThird");

const bugStyle = computed((): CSSProperties => {
	return {
		height: "100vh",
		left: lowerThird.value!.bug.offsetX + "vw",
		overflow: "hidden",
		position: "absolute",
		bottom: lowerThird.value!.bug.offsetY - 1 + "vh",
		width: "100vw",
	}
});

</script>

<style scoped>
</style>
